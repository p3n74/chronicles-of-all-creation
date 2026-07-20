param(
    [Parameter(Mandatory = $true)][string]$InPath,
    [Parameter(Mandatory = $true)][string]$OutPath,
    [int]$Threshold = 42
)

Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::new($InPath)
$bmp = [System.Drawing.Bitmap]::new($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($src, 0, 0, $src.Width, $src.Height)
$g.Dispose()
$src.Dispose()

$w = $bmp.Width
$h = $bmp.Height
$rect = [System.Drawing.Rectangle]::new(0, 0, $w, $h)
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, $bmp.PixelFormat)
$bytes = [byte[]]::new([Math]::Abs($data.Stride) * $h)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
$stride = $data.Stride

# BFS from all border pixels: any near-black pixel connected to the border becomes transparent.
$visited = [bool[]]::new($w * $h)
$queue = [System.Collections.Generic.Queue[int]]::new()

function Test-Dark([byte[]]$px, [int]$stride, [int]$x, [int]$y, [int]$t) {
    $i = $y * $stride + $x * 4
    return ($px[$i] -le $t) -and ($px[$i + 1] -le $t) -and ($px[$i + 2] -le $t)
}

for ($x = 0; $x -lt $w; $x++) {
    foreach ($y in @(0, ($h - 1))) {
        if (-not $visited[$y * $w + $x] -and (Test-Dark $bytes $stride $x $y $Threshold)) {
            $visited[$y * $w + $x] = $true
            $queue.Enqueue($y * $w + $x)
        }
    }
}
for ($y = 0; $y -lt $h; $y++) {
    foreach ($x in @(0, ($w - 1))) {
        if (-not $visited[$y * $w + $x] -and (Test-Dark $bytes $stride $x $y $Threshold)) {
            $visited[$y * $w + $x] = $true
            $queue.Enqueue($y * $w + $x)
        }
    }
}

$cleared = 0
while ($queue.Count -gt 0) {
    $idx = $queue.Dequeue()
    $cx = $idx % $w
    $cy = [Math]::Floor($idx / $w)
    $bytes[$cy * $stride + $cx * 4 + 3] = 0
    $cleared++

    foreach ($d in @(@(1, 0), @(-1, 0), @(0, 1), @(0, -1))) {
        $nx = $cx + $d[0]
        $ny = $cy + $d[1]
        if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
            $nidx = $ny * $w + $nx
            if (-not $visited[$nidx] -and (Test-Dark $bytes $stride $nx $ny $Threshold)) {
                $visited[$nidx] = $true
                $queue.Enqueue($nidx)
            }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
$bmp.UnlockBits($data)
$bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Cleared $cleared of $($w * $h) pixels -> $OutPath"
