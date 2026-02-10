# Script de Instalação e Execução do Projeto
# Sistema de Gerenciamento de Igreja

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Sistema de Gerenciamento de Igreja" -ForegroundColor Cyan
Write-Host "Instalacao e Configuracao" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar .NET SDK
Write-Host "Verificando .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "✓ .NET SDK encontrado: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ .NET SDK nao encontrado. Por favor, instale o .NET 8 SDK." -ForegroundColor Red
    Write-Host "Download: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
    exit 1
}

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js nao encontrado. Por favor, instale Node.js 18+." -ForegroundColor Red
    Write-Host "Download: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Configurando Backend" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configurar Backend
Set-Location backend

Write-Host "Instalando dependencias do backend..." -ForegroundColor Yellow
dotnet restore

Write-Host "Criando banco de dados..." -ForegroundColor Yellow
dotnet ef migrations add InitialCreate 2>$null
dotnet ef database update

Write-Host "✓ Backend configurado com sucesso!" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Configurando Frontend" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configurar Frontend
Set-Location frontend

Write-Host "Instalando dependencias do frontend..." -ForegroundColor Yellow
npm install

Write-Host "✓ Frontend configurado com sucesso!" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "Instalacao Concluida!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciais de acesso:" -ForegroundColor Yellow
Write-Host "  Email: admin@igreja.com" -ForegroundColor White
Write-Host "  Senha: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "Para executar o sistema:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend (em um terminal):" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   dotnet run" -ForegroundColor White
Write-Host ""
Write-Host "2. Frontend (em outro terminal):" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "3. Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
