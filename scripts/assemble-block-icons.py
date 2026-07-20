#!/usr/bin/env python3
"""
Assemble flat Minecraft block-face textures into isometric inventory cubes.

Reads icons/unique_items and icons/manifest.tsv. When a unique item was sourced
from a block texture (or is a fully-opaque square face), rewrite it as a
classic 3/4 isometric cube using that face for top + sides (sides darkened).

Usage:
  python3 scripts/assemble-block-icons.py
  python3 scripts/assemble-block-icons.py --force   # re-assemble even if already iso
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
ICONS = ROOT / "icons"
UNIQUE = ICONS / "unique_items"
MANIFEST = ICONS / "manifest.tsv"
PUBLIC = ROOT / "apps/web/public/quest-icons"

# Heuristic: item sprites have transparent corners; flat block faces do not.
CORNER_TRANSPARENT_MAX = 0.15
OPAQUE_MIN = 0.92


def face_stats(im: Image.Image) -> tuple[float, float]:
    """Return (corner_transparency, opaque_ratio) on a 32×32 sample."""
    im = im.convert("RGBA")
    small = im.resize((32, 32), Image.Resampling.NEAREST)
    px = small.load()
    w, h = small.size
    cw, ch = max(1, w // 8), max(1, h // 8)
    corner_t = corner_n = opaque = total = 0
    for y in range(h):
        for x in range(w):
            a = px[x, y][3]
            total += 1
            if a > 200:
                opaque += 1
    for x0, y0 in ((0, 0), (w - cw, 0), (0, h - ch), (w - cw, h - ch)):
        for y in range(y0, y0 + ch):
            for x in range(x0, x0 + cw):
                corner_n += 1
                if px[x, y][3] < 10:
                    corner_t += 1
    return corner_t / corner_n, opaque / total


def is_flat_block_face(im: Image.Image) -> bool:
    corner_t, opaque = face_stats(im)
    return corner_t <= CORNER_TRANSPARENT_MAX and opaque >= OPAQUE_MIN


def looks_isometric(im: Image.Image) -> bool:
    """Assembled cubes have mostly transparent corners."""
    corner_t, _ = face_stats(im)
    return corner_t >= 0.5


def darken(im: Image.Image, factor: float) -> Image.Image:
    """Darken RGB, preserve alpha."""
    rgb = im.convert("RGB")
    rgb = ImageEnhance.Brightness(rgb).enhance(factor)
    out = rgb.convert("RGBA")
    out.putalpha(im.getchannel("A"))
    return out


def shear_horizontal(im: Image.Image, shear: float) -> Image.Image:
    """Shear X by shear * y (affine)."""
    w, h = im.size
    # New width grows by |shear| * h
    extra = abs(int(shear * (h - 1)))
    new_w = w + extra
    # PIL affine: x' = a*x + b*y + c
    # For shear right as y increases: x' = x + shear*y
    if shear >= 0:
        a, b, c = 1, shear, 0
    else:
        a, b, c = 1, shear, -shear * (h - 1)
    return im.transform(
        (new_w, h),
        Image.Transform.AFFINE,
        (a, b, c, 0, 1, 0),
        resample=Image.Resampling.NEAREST,
        fillcolor=(0, 0, 0, 0),
    )


def shear_vertical(im: Image.Image, shear: float) -> Image.Image:
    """Shear Y by shear * x."""
    w, h = im.size
    extra = abs(int(shear * (w - 1)))
    new_h = h + extra
    if shear >= 0:
        data = (1, 0, 0, shear, 1, 0)
    else:
        data = (1, 0, 0, shear, 1, -shear * (w - 1))
    return im.transform(
        (w, new_h),
        Image.Transform.AFFINE,
        data,
        resample=Image.Resampling.NEAREST,
        fillcolor=(0, 0, 0, 0),
    )


def assemble_isometric(face: Image.Image, out_size: int = 512) -> Image.Image:
    """
    Build a Minecraft-style isometric block icon from a single square face.
    Uses the face for top + both sides (sides darkened).
    """
    # Work at 16px texel resolution then nearest-scale up for crisp pixels.
    face16 = face.convert("RGBA").resize((16, 16), Image.Resampling.NEAREST)

    top = face16.copy()
    left = darken(face16, 0.72)
    right = darken(face16, 0.55)

    # Scale faces for the cube body (each face ~22px before shear in a 32 canvas)
    face_px = 22
    top = top.resize((face_px, face_px), Image.Resampling.NEAREST)
    left = left.resize((face_px, face_px), Image.Resampling.NEAREST)
    right = right.resize((face_px, face_px), Image.Resampling.NEAREST)

    # Top: rotate 45° then squash vertically → diamond
    top = top.rotate(45, resample=Image.Resampling.NEAREST, expand=True)
    tw, th = top.size
    top = top.resize((tw, max(1, th // 2)), Image.Resampling.NEAREST)

    # Sides: squash height then shear into parallelograms
    side_h = face_px
    left = left.resize((face_px, side_h), Image.Resampling.NEAREST)
    right = right.resize((face_px, side_h), Image.Resampling.NEAREST)
    # Squash vertically for perspective
    left = left.resize((face_px, int(side_h * 0.65)), Image.Resampling.NEAREST)
    right = right.resize((face_px, int(side_h * 0.65)), Image.Resampling.NEAREST)
    left = shear_horizontal(left, 0.5)
    right = shear_horizontal(right, -0.5)

    canvas = Image.new("RGBA", (64, 64), (0, 0, 0, 0))

    # Placement tuned for a centered inventory-style cube
    top_x = (64 - top.size[0]) // 2
    top_y = 8
    canvas.alpha_composite(top, (top_x, top_y))

    # Sides meet under the top diamond
    mid_x = 32
    join_y = top_y + top.size[1] - 2
    left_x = mid_x - left.size[0] + 1
    right_x = mid_x - 1
    canvas.alpha_composite(left, (left_x, join_y))
    canvas.alpha_composite(right, (right_x, join_y))

    # Upscale nearest-neighbor to target
    return canvas.resize((out_size, out_size), Image.Resampling.NEAREST)


def block_item_ids_from_manifest() -> set[str]:
    ids: set[str] = set()
    if not MANIFEST.exists():
        return ids
    for line in MANIFEST.read_text(encoding="utf-8").splitlines()[1:]:
        parts = line.split("\t")
        if len(parts) < 7:
            continue
        item_id, src = parts[3], parts[6]
        if "/block/" in src or "/blocks/" in src:
            ids.add(item_id)
        if re.search(r"_(side|top|front|bottom|end|particle)\.png$", src):
            ids.add(item_id)
    return ids


def item_id_from_unique_name(name: str) -> str:
    # create__mechanical_press.png → create:mechanical_press
    stem = name[:-4] if name.endswith(".png") else name
    if "__" not in stem:
        return stem
    mod, item = stem.split("__", 1)
    return f"{mod}:{item}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--size", type=int, default=512)
    args = ap.parse_args()

    if not UNIQUE.exists():
        print("Missing", UNIQUE, file=sys.stderr)
        return 1

    block_ids = block_item_ids_from_manifest()
    PUBLIC.mkdir(parents=True, exist_ok=True)

    assembled = skipped = copied = 0

    def process_file(path: Path, item_id: str, write_public: bool) -> None:
        nonlocal assembled, skipped, copied
        im = Image.open(path).convert("RGBA")
        from_manifest = item_id in block_ids
        flat = is_flat_block_face(im)
        already_iso = looks_isometric(im)

        # Assemble: flat faces, or manifest block sources not yet iso.
        if args.force or flat or (from_manifest and not already_iso):
            out_im = assemble_isometric(im, args.size)
            out_im.save(path)
            assembled += 1
        else:
            out_im = (
                im
                if im.size == (args.size, args.size)
                else im.resize((args.size, args.size), Image.Resampling.NEAREST)
            )
            skipped += 1

        if write_public:
            dest = PUBLIC / path.name
            out_im.save(dest)
            copied += 1

    for path in sorted(UNIQUE.glob("*.png")):
        process_file(path, item_id_from_unique_name(path.name), write_public=True)

    # Re-assemble flat faces inside by_chapter copies too (quest-specific files)
    by_chapter = ICONS / "by_chapter"
    if by_chapter.exists():
        for path in sorted(by_chapter.rglob("*.png")):
            m = re.match(
                r"^\d+_.+?__([a-z0-9_]+)__([a-z0-9_]+)\.png$", path.name, re.I
            )
            if not m:
                continue
            item_id = f"{m.group(1)}:{m.group(2)}"
            # Prefer already-assembled unique_items file when available
            unique_name = f"{m.group(1)}__{m.group(2)}.png"
            unique_path = UNIQUE / unique_name
            if unique_path.exists():
                # Sync quest copy from assembled unique item
                Image.open(unique_path).save(path)
                skipped += 1
            else:
                process_file(path, item_id, write_public=False)

    print(f"Assembled {assembled} block cubes")
    print(f"Left as-is / synced {skipped}")
    print(f"Wrote {copied} → {PUBLIC}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
