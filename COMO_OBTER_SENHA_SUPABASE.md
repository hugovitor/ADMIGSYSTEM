# 🔐 Como Obter a Senha Correta do Supabase

## Método 1: Dashboard do Supabase (Recomendado)

1. **Acesse o Dashboard:**
   - https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/settings/database

2. **Encontre a senha:**
   - Role até a seção **"Connection String"**
   - Clique em **"URI"** 
   - Copie a connection string completa que será algo como:
     ```
     postgresql://postgres.xxxxxx:SUA_SENHA_AQUI@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```
   - A parte `SUA_SENHA_AQUI` é sua senha real

## Método 2: Resetar Senha (Se não lembrar)

1. No mesmo dashboard, procure por **"Reset Database Password"**
2. Clique e defina uma nova senha
3. **IMPORTANTE:** Anote a senha em um lugar seguro!

---

## ✅ Configuração Rápida

### Opção A: Script Automático (PowerShell)
```powershell
.\configure_supabase.ps1
```
O script vai:
1. Pedir a senha
2. Fazer URL encoding automaticamente
3. Criar o arquivo `.env.local`
4. Testar a conexão

### Opção B: Manual

1. **Obtenha a senha real do Supabase**

2. **Se a senha tiver caracteres especiais, codifique:**
   ```
   @ → %40
   # → %23
   $ → %24
   ```

3. **Crie/edite `backend/.env.local`:**
   ```bash
   DATABASE_URL=postgresql://postgres:SUA_SENHA_CODIFICADA@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
   FORCE_SQLITE=false
   ```

4. **Teste a conexão:**
   ```powershell
   cd backend
   $env:DATABASE_URL = "postgresql://postgres:SUA_SENHA@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres"
   dotnet ef database update
   ```

---

## 🚨 Troubleshooting

### Erro: "password authentication failed"
- **Causa:** Senha incorreta ou não URL-encoded
- **Solução:** 
  1. Confirme a senha no dashboard do Supabase
  2. Se tiver `@` na senha, use `%40`

### Erro: "no pg_hba.conf entry for host"
- **Causa:** IP não está na whitelist
- **Solução:**
  1. Vá em: https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/settings/database
  2. Role até **"Connection Pooling"** > **"IP Allowlist"**
  3. Adicione `0.0.0.0/0` (permite todos os IPs) ou seu IP específico

### Erro: "Could not translate host name"
- **Causa:** Connection string incorreta
- **Solução:** Copie a connection string diretamente do dashboard do Supabase

---

## 📋 Checklist Pós-Configuração

- [ ] Connection string funciona localmente (`dotnet ef database update`)
- [ ] Tabelas criadas no Supabase (verifique no Table Editor)
- [ ] Usuário admin criado (login: admin@igreja.com)
- [ ] DATABASE_URL configurada no Render.com
- [ ] Deploy feito e backend usando PostgreSQL (veja logs)
- [ ] Dados persistem após novo deploy

---

## 🎯 Exemplo Completo

**Supondo que sua senha seja:** `MyP@ss123!`

**Connection string local:**
```
postgresql://postgres:MyP%40ss123!@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
```
(Note o `%40` substituindo o `@`)

**No Render.com:**
- **Key:** `DATABASE_URL`
- **Value:** `postgresql://postgres:MyP%40ss123!@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres`

---

## 💡 Dica Pro

Use o **Connection Pooler** do Supabase para melhor performance:
```
postgresql://postgres.xxxxxxx:SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
(Encontre a URL completa em: Settings → Database → Connection String → URI com pooling)
