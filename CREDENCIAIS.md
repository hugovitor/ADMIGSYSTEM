# 🔐 Credenciais e Configuração do Sistema

## ✅ Banco de Dados: Supabase PostgreSQL

**Status:** Configurado e funcionando

### Connection String
```
postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
```

### Dashboard Supabase
- **URL:** https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx
- **Table Editor:** https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/editor
- **SQL Editor:** https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/editor

---

## 👤 Usuário Admin

**Email:** `admin@igreja.com`  
**Senha:** `Admin@123`

---

## 🚀 Como Rodar Localmente

### Backend
```powershell
cd backend
$env:DATABASE_URL = "postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres"
dotnet run
```

Backend estará em: http://localhost:5000  
Swagger: http://localhost:5000/swagger

**Nota:** A variável DATABASE_URL é obrigatória. Sem ela, o backend não inicia.

### Frontend
```powershell
cd frontend
npm run dev
```

Frontend estará em: http://localhost:5173

---

## 🌐 Produção

### URLs
- **Frontend:** https://admigsystem.vercel.app
- **Backend:** https://church-management-backend-7owp.onrender.com
- **API Base:** https://church-management-backend-7owp.onrender.com/api

### Configurar Render.com

1. Acesse: https://dashboard.render.com
2. Selecione o serviço backend
3. Vá em **Environment** → **Add Environment Variable**
4. Adicione:
   ```
   DATABASE_URL=postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
   ```
5. Clique em **Save Changes**
6. Deploy será feito automaticamente

---

## 📋 Migrations

### Criar Nova Migration
```powershell
cd backend
$env:DATABASE_URL = "postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres"
dotnet ef migrations add NomeDaMigration
dotnet ef database update
```

### Migration Atual
- `20260218213848_InitialPostgreSQL` ✅ Aplicada

---

## 🔧 Troubleshooting

### Backend não conecta no Supabase
1. Confirme que DATABASE_URL está definida:
   ```powershell
   $env:DATABASE_URL
   ```
2. Teste a conexão:
   ```powershell
   dotnet ef database update
   ```

### Dados não persistem após deploy
- Verifique se DATABASE_URL está configurada no Render
- Veja os logs: procure por "🐘 Database: PostgreSQL"
- Se aparecer "📦 Database: SQLite", a variável não está sendo lida

### Erro 401 no login
**Credenciais corretas:**
- Email: `admin@igreja.com`
- Senha: `Admin@123` (com @ no meio, não no final)

---

## 📊 Tabelas no Banco

- ✅ Users
- ✅ MusicSchoolStudents
- ✅ MusicSchoolPreRegistrations
- ✅ JiuJitsuStudents
- ✅ JiuJitsuGraduations
- ✅ JiuJitsuAttendances
- ✅ JiuJitsuPayments
- ✅ MensGroupMembers
- ✅ Members
- ✅ FamilyMembers
- ✅ ChildPresentations

---

## 🎯 Próximos Passos

1. ✅ Supabase configurado localmente
2. ⏳ Configurar DATABASE_URL no Render
3. ⏳ Fazer deploy
4. ⏳ Testar em produção

**Comando para deploy:**
```powershell
git add .
git commit -m "Configurar Supabase PostgreSQL - Persistência permanente"
git push origin main
```
