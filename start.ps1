# Script para executar Backend e Frontend simultaneamente
# Sistema de Gerenciamento de Igreja

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Iniciando Sistema de Gerenciamento" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Função para executar o backend
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    dotnet run
}

Write-Host "✓ Backend iniciado" -ForegroundColor Green
Start-Sleep -Seconds 5

# Função para executar o frontend
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    npm run dev
}

Write-Host "✓ Frontend iniciado" -ForegroundColor Green
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Sistema em execucao!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Swagger: http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciais:" -ForegroundColor Yellow
Write-Host "  Email: admin@igreja.com" -ForegroundColor White
Write-Host "  Senha: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "Pressione Ctrl+C para parar os servidores" -ForegroundColor Red
Write-Host ""

# Aguardar até que o usuário pressione Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Parando servidores..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob
    Remove-Job $backendJob, $frontendJob
    Write-Host "✓ Servidores parados" -ForegroundColor Green
}
