# Script simples para testar certificado
$apiUrl = "http://localhost:5000/api"

# 1. Login
$loginBody = @{
    email = "admin@igreja.com"
    password = "Admin@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token

$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}

# 2. Tentar gerar certificado para ID 1
try {
    Write-Host "Tentando gerar certificado para ID 1..." -ForegroundColor Yellow
    $certResponse = Invoke-RestMethod -Uri "$apiUrl/childpresentation/1/certificate" -Method POST -Headers $headers
    Write-Host "Sucesso! Certificado gerado: $($certResponse.certificatePath)" -ForegroundColor Green
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    
    # Tentar obter detalhes do erro
    try {
        $errorDetails = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorDetails)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Detalhes do erro: $errorBody" -ForegroundColor Red
    } catch {
        Write-Host "Não foi possível obter detalhes adicionais do erro" -ForegroundColor Red
    }
}