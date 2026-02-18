# Script para configurar e testar conexão com Supabase
# Execute: .\configure_supabase.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Configuração Supabase PostgreSQL" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Obter senha
Write-Host "📋 PASSO 1: Obter senha do Supabase" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse: https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/settings/database"
Write-Host "2. Procure por 'Database Password' ou clique em 'Connection String'"
Write-Host "3. Copie a senha (provavelmente diferente de '[Hpn16@12022]')"
Write-Host ""
$password = Read-Host "Digite a senha do Supabase"

# URL Encode caracteres especiais
$encodedPassword = [System.Web.HttpUtility]::UrlEncode($password)

Write-Host ""
Write-Host "✅ Senha codificada: $encodedPassword" -ForegroundColor Green
Write-Host ""

# Passo 2: Criar connection string
$connectionString = "postgresql://postgres:$encodedPassword@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres"

Write-Host "📝 PASSO 2: Salvando em backend\.env.local" -ForegroundColor Yellow
$envContent = @"
# Supabase PostgreSQL Connection
DATABASE_URL=$connectionString

# Force PostgreSQL (não use SQLite)
FORCE_SQLITE=false

# Não resetar banco de dados
RESET_DATABASE=false
FORCE_DB_CREATE=false
"@

Set-Content -Path ".\backend\.env.local" -Value $envContent
Write-Host "✅ Arquivo .env.local criado!" -ForegroundColor Green
Write-Host ""

# Passo 3: Testar conexão
Write-Host "🔌 PASSO 3: Testando conexão..." -ForegroundColor Yellow
cd backend
$env:DATABASE_URL = $connectionString

Write-Host "Executando: dotnet ef database update" -ForegroundColor Gray
dotnet ef database update

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCESSO! Supabase configurado e migrations aplicadas!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Configure a mesma DATABASE_URL no Render.com"
    Write-Host "2. Faça deploy: git add . && git commit -m 'Configurar Supabase' && git push"
    Write-Host "3. Verifique os logs do Render para confirmar PostgreSQL"
} else {
    Write-Host ""
    Write-Host "❌ ERRO: Falha ao conectar no Supabase" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verifique se a senha está correta"
    Write-Host "2. Confirme que o IP está na whitelist do Supabase"
    Write-Host "3. Tente resetar a senha no dashboard do Supabase"
}

cd ..
