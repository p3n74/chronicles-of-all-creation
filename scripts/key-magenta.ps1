param(
    [Parameter(Mandatory = $true)][string]$InPath,
    [Parameter(Mandatory = $true)][string]$OutPath
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

$cleared = 0
for ($y = 0; $y -lt $h; $y++) {
    $row = $y * $stride
    for ($x = 0; $x -lt $w; $x++) {
        $i = $row + $x * 4
        $b = $bytes[$i]
        $gg = $bytes[$i + 1]
        $r = $bytes[$i + 2]
        # Magenta key: red and blue dominate green strongly.
        if (($r - $gg) -gt 70 -and ($b - $gg) -gt 70) {
            $bytes[$i + 3] = 0
            $cleared++
        }
        # Fringe softening: mildly magenta pixels get partial alpha and desaturated toward gray.
        elseif (($r - $gg) -gt 35 -and ($b - $gg) -gt 35) {
            $bytes[$i + 3] = 110
            $avg = [byte](($r + $gg + $b) / 3)
            $bytes[$i] = $avg
            $bytes[$i + 1] = $avg
            $bytes[$i + 2] = $avg
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
$bmp.UnlockBits($data)
$bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Keyed $cleared of $($w * $h) pixels -> $OutPath"
