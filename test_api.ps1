# Script para testar a API
$apiUrl = "http://localhost:5000/api"

# 1. Login
$loginBody = @{
    email = "admin@igreja.com"
    password = "Admin@123"
} | ConvertTo-Json

Write-Host "Fazendo login..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "Token obtido: $($token.Substring(0,50))..." -ForegroundColor Green

$headers = @{
    'Authorization' = "Bearer $token"
    'Content-Type' = 'application/json'
}

# 2. Verificar apresentações existentes
Write-Host "Verificando apresentações existentes..." -ForegroundColor Yellow
try {
    $presentations = Invoke-RestMethod -Uri "$apiUrl/childpresentation" -Method GET -Headers $headers
    Write-Host "Apresentações encontradas: $($presentations.Count)" -ForegroundColor Green
    
    if ($presentations.Count -gt 0) {
        $presentation = $presentations[0]
        Write-Host "Primeira apresentação: ID=$($presentation.id), Nome=$($presentation.childName)" -ForegroundColor Green
        
        # 3. Tentar gerar certificado
        Write-Host "Tentando gerar certificado..." -ForegroundColor Yellow
        try {
            $certResponse = Invoke-RestMethod -Uri "$apiUrl/childpresentation/$($presentation.id)/certificate" -Method POST -Headers $headers
            Write-Host "Certificado gerado: $($certResponse.certificatePath)" -ForegroundColor Green
            
            # 4. Tentar baixar certificado
            Write-Host "Tentando baixar certificado..." -ForegroundColor Yellow
            $downloadHeaders = @{
                'Authorization' = "Bearer $token"
            }
            
            # Download como arquivo
            $downloadResponse = Invoke-WebRequest -Uri "$apiUrl/childpresentation/$($presentation.id)/certificate/download" -Method GET -Headers $downloadHeaders -OutFile "certificado_teste.pdf"
            Write-Host "Certificado baixado com sucesso!" -ForegroundColor Green
            
        } catch {
            Write-Host "Erro ao gerar/baixar certificado: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "Detalhes: $($_.Exception.Response)" -ForegroundColor Red
        }
        
    } else {
        # Criar uma apresentação de teste
        Write-Host "Criando apresentação de teste..." -ForegroundColor Yellow
        $newPresentation = @{
            childName = "João Silva"
            birthDate = "2022-01-15T00:00:00"
            gender = "Masculino"
            birthPlace = "São Paulo, SP"
            fatherName = "José Silva"
            fatherProfession = "Engenheiro"
            motherName = "Maria Silva"
            motherProfession = "Professora"
            presentationDate = "2024-02-10T14:00:00"
            churchName = "Igreja Batista Central"
            pastor = "Pastor Carlos Santos"
            biblicalVerse = "Deixai vir a mim as criancinhas - Mateus 19:14"
            specialMessage = "Que Deus abençoe esta criança"
            address = "Rua das Flores, 123"
            witnessNames = "Ana Costa;Pedro Lima"
        } | ConvertTo-Json
        
        $createdPresentation = Invoke-RestMethod -Uri "$apiUrl/childpresentation" -Method POST -Body $newPresentation -Headers $headers
        Write-Host "Apresentação criada: ID=$($createdPresentation.id)" -ForegroundColor Green
        
        # Tentar gerar certificado para a nova apresentação
        Write-Host "Gerando certificado para nova apresentação..." -ForegroundColor Yellow
        $certResponse = Invoke-RestMethod -Uri "$apiUrl/childpresentation/$($createdPresentation.id)/certificate" -Method POST -Headers $headers
        Write-Host "Certificado gerado: $($certResponse.certificatePath)" -ForegroundColor Green
    }
    
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    }
}