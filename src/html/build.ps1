param()

$srcDir = $PSScriptRoot
$repoRoot = Split-Path (Split-Path $srcDir -Parent) -Parent
$templatePath = Join-Path $srcDir "index.template.html"
$output = Join-Path $repoRoot "index.html"

if (-not (Test-Path $templatePath)) {
    Write-Error "Template not found: $templatePath"
    exit 1
}

function Expand-Includes {
    param([string]$content, [string]$baseDir)

    $regex = [regex]'<!--\s*@include\s+([^\s]+)\s*-->'
    $maxPasses = 5
    $pass = 0

    while ($regex.IsMatch($content) -and $pass -lt $maxPasses) {
        $pass++
        $content = $regex.Replace($content, {
            param($match)
            $relPath = $match.Groups[1].Value.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $baseDir $relPath
            if (-not (Test-Path $filePath)) {
                Write-Error "Include file not found: $filePath"
                exit 1
            }
            return (Get-Content $filePath -Raw -Encoding UTF8)
        })
    }
    return $content
}

$templateContent = Get-Content $templatePath -Raw -Encoding UTF8
$finalHtml = Expand-Includes -content $templateContent -baseDir $srcDir

$finalHtml = $finalHtml.TrimEnd() + "`n"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($output, $finalHtml, $utf8NoBom)

$lineCount = ($finalHtml -split "`r`n|`n").Count
Write-Host "index.html generated: $output ($lineCount lines)"
