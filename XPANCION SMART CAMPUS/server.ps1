# Lightweight PowerShell Static HTTP Server for SmartCampus
$port = 5000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "SmartCampus server running at http://localhost:$port/"
} catch {
    Write-Warning "Could not bind to port $port. Error: $_"
    exit 1
}

$baseDir = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = 'index.html'
        }
        
        $filePath = Join-Path $baseDir $localPath
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.KeepAlive = $false
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.json' { 'application/json' }
                '.svg'  { 'image/svg+xml' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                default { 'application/octet-stream' }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $err = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $err.Length
            $response.OutputStream.Write($err, 0, $err.Length)
        }
        $response.OutputStream.Close()
        $response.Close()
    } catch {
        # Keep serving
    }
}
