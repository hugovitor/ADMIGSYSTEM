# 🔧 Como Limpar e Recriar o Banco Supabase

## Problema
As migrations foram criadas inicialmente para SQLite (usa INTEGER para boolean) mas o Supabase usa PostgreSQL (usa BOOLEAN). Isso causa conflitos.

## Solução: Limpar e Recriar

### 1️⃣ Deletar Tabelas no Supabase

**Opção A - SQL Editor (Recomendado):**
1. Acesse: https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/editor
2. Clique em **SQL Editor**
3. Cole e execute o conteúdo do arquivo `drop_tables.sql`:

```sql
DROP TABLE IF EXISTS "__EFMigrationsHistory" CASCADE;
DROP TABLE IF EXISTS "ChildPresentations" CASCADE;
DROP TABLE IF EXISTS "FamilyMembers" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuAttendances" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuGraduations" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuPayments" CASCADE;
DROP TABLE IF EXISTS "JiuJitsuStudents" CASCADE;
DROP TABLE IF EXISTS "Members" CASCADE;
DROP TABLE IF EXISTS "MensGroupMembers" CASCADE;
DROP TABLE IF EXISTS "MusicSchoolPreRegistrations" CASCADE;
DROP TABLE IF EXISTS "MusicSchoolStudents" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
```

4. Clique em **Run** ou pressione `Ctrl + Enter`

### 2️⃣ Aplicar Nova Migration

```powershell
cd backend
$env:DATABASE_URL = "postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres"
dotnet ef database update
```

### 3️⃣ Iniciar Backend e Criar Admin

```powershell
$env:DATABASE_URL = "postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres"
dotnet run
```

Logs esperados:
```
✅ Database setup completed successfully
✅ Database seeding completed
✅ Admin user created successfully
```

### 4️⃣ Testar Login

```powershell
# No navegador: http://localhost:5000/swagger
# Ou use curl:
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@igreja.com","password":"Admin123!@#"}'
```

---

## ✅ Verificar no Supabase Dashboard

1. **Table Editor:** https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/editor
2. Você deve ver todas as tabelas:
   - Users (com admin@igreja.com)
   - MusicSchoolStudents
   - JiuJitsuStudents
   - Members
   - etc.

---

## 🚀 Configurar no Render

Depois de testar localmente:

1. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
   FORCE_SQLITE=false
   ```

2. **Deploy:**
   ```powershell
   git add .
   git commit -m "Migrar para Supabase PostgreSQL"
   git push origin main
   ```

3. **Verificar Logs do Render:**
   ```
   🐘 Database: PostgreSQL
   🌐 Host: db.hnegqsgcabjroprpjzxx.supabase.co
   ✅ Database setup completed successfully
   ```

---

## 📝 Notas

- ✅ Nova migration criada: `20260218213848_InitialPostgreSQL`
- ✅ Usa tipos nativos do PostgreSQL (boolean, timestamp with time zone)
- ✅ Compatível com Supabase
- ✅ Dados serão persistidos permanentemente
