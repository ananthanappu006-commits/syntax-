$port = 8080
$rootPath = "$PSScriptRoot\dist"
$url = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host ""
Write-Host "  Mechtrolicz Habit Tracker is running!" -ForegroundColor Cyan
Write-Host "  Open in browser: http://localhost:$port" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

Start-Process "http://localhost:$port"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }

        $filePath = Join-Path $rootPath $localPath.TrimStart('/')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath)
            $mimeMap = @{
                ".html" = "text/html; charset=utf-8"
                ".js"   = "application/javascript"
                ".css"  = "text/css"
                ".json" = "application/json"
                ".png"  = "image/png"
                ".jpg"  = "image/jpeg"
                ".svg"  = "image/svg+xml"
                ".ico"  = "image/x-icon"
                ".woff2"= "font/woff2"
                ".woff" = "font/woff"
                ".ttf"  = "font/ttf"
            }
            $mime = if ($mimeMap.ContainsKey($ext)) { $mimeMap[$ext] } else { "application/octet-stream" }
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            # SPA fallback - serve index.html for unknown routes
            $indexPath = Join-Path $rootPath "index.html"
            $content = [System.IO.File]::ReadAllBytes($indexPath)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }

        $response.OutputStream.Close()
    } catch {
        if ($listener.IsListening) {
            Write-Host "Error: $_" -ForegroundColor Red
        }
    }
}
