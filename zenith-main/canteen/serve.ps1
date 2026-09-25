# Smart Canteen Management Platform - Local Static Web Server
param(
    [int]$Port = 3000
)

$RootPath = $PSScriptRoot
if (-not $RootPath) { $RootPath = "d:\canteen" }

$Listener = New-Object System.Net.HttpListener
$Prefix = "http://localhost:$Port/"
$Listener.Prefixes.Add($Prefix)

try {
    $Listener.Start()
} catch {
    Write-Host "Failed to start listener on $Prefix. Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  🍱 Smart Canteen Management Platform is Live!" -ForegroundColor Green
Write-Host "  URL: $Prefix" -ForegroundColor Cyan
Write-Host "  Serving from: $RootPath" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

# Launch browser
Start-Process $Prefix

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($Listener.IsListening) {
    try {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response

        $UrlPath = [System.Uri]::UnescapeDataString($Request.Url.AbsolutePath)
        if ($UrlPath -eq "/" -or [string]::IsNullOrWhiteSpace($UrlPath)) {
            $UrlPath = "/index.html"
        }

        $RelativePath = $UrlPath.TrimStart("/").Replace("/", "\")
        $FilePath = Join-Path $RootPath $RelativePath

        if (Test-Path $FilePath -PathType Leaf) {
            $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
            $ContentType = $MimeTypes[$Ext]
            if (-not $ContentType) { $ContentType = "application/octet-stream" }

            $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
            $Response.ContentType = $ContentType
            $Response.ContentLength64 = $Bytes.Length
            $Response.StatusCode = 200
            $Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
            Write-Host "[$($Request.HttpMethod)] $UrlPath -> 200 OK ($($Bytes.Length) bytes)" -ForegroundColor Gray
        } else {
            $Response.StatusCode = 404
            $ErrMsg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $UrlPath")
            $Response.ContentType = "text/plain"
            $Response.ContentLength64 = $ErrMsg.Length
            $Response.OutputStream.Write($ErrMsg, 0, $ErrMsg.Length)
            Write-Host "[$($Request.HttpMethod)] $UrlPath -> 404 Not Found" -ForegroundColor Red
        }

        $Response.OutputStream.Close()
    } catch {
        # Catch unexpected client aborts or errors
    }
}
