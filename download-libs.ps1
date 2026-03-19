# Notebook GM - オフライン用ライブラリ取得スクリプト
# このスクリプトを NotebookGM フォルダで実行: .\download-libs.ps1

$ErrorActionPreference = 'Stop'
$libsDir = Join-Path $PSScriptRoot 'libs'
if (-not (Test-Path $libsDir)) { New-Item -ItemType Directory -Path $libsDir -Force | Out-Null }

$urls = @{
    'papaparse.min.js' = 'https://unpkg.com/papaparse@5.4.1/papaparse.min.js'
    'chart.umd.min.js' = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
    'html2pdf.bundle.min.js' = 'https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js'
}

foreach ($file in $urls.Keys) {
    $path = Join-Path $libsDir $file
    $url = $urls[$file]
    Write-Host "Downloading $file ..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing
        Write-Host "  OK: $path"
    } catch {
        Write-Warning "  Failed: $url - $_"
    }
}
Write-Host "Done. If any failed, see libs/README.txt for manual URLs."
