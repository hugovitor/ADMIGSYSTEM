# Configuração do Supabase PostgreSQL

## ✅ Configuração Local

### Backend (.env.local)
Já criado: `backend/.env.local`

```bash
DATABASE_URL=postgresql://postgres:Hpn16@12022@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
FORCE_SQLITE=false
```

### Testar Localmente
```powershell
cd backend
dotnet ef database update
dotnet run
```

---

## 🚀 Configuração no Render

### Passo 1: Adicionar Variável de Ambiente
1. Acesse: https://dashboard.render.com
2. Selecione seu serviço backend
3. Vá em **Environment** → **Add Environment Variable**
4. Adicione:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:Hpn16@12022@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres`

### Passo 2: Adicionar Outras Variáveis
```
FORCE_SQLITE=false
RESET_DATABASE=false
FORCE_DB_CREATE=false
```

### Passo 3: Deploy
Clique em **Manual Deploy** → **Deploy latest commit**

---

## 🔍 Verificar se Funcionou

### Logs do Backend (Render ou Local)
Procure por estas mensagens:
```
✅ Using PostgreSQL in production
✅ Running migrations...
✅ Database setup completed successfully
```

### Testar API
```powershell
# Login
curl -X POST https://SEU-BACKEND.onrender.com/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@igreja.com","password":"Admin123!@#"}'
```

---

## ⚠️ IMPORTANTE: Senha Correta do Supabase

### Como obter a senha correta:
1. Acesse: https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/settings/database
2. Procure por **Database Password** ou **Connection String**
3. Copie a senha exata (NÃO inclua colchetes `[]`)

### URL Encoding para caracteres especiais:
Se a senha tiver caracteres especiais, use URL encoding:

| Caractere | Codificado |
|-----------|------------|
| `@`       | `%40`      |
| `#`       | `%23`      |
| `$`       | `%24`      |
| `%`       | `%25`      |
| `&`       | `%26`      |
| `+`       | `%2B`      |
| ` `(espaço)| `%20`     |

**Exemplo:**
```
Senha original: Teste@123#
Senha codificada: Teste%40123%23

Connection string:
postgresql://postgres:Teste%40123%23@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
```

---

## 🗄️ Migrations

### Criar Nova Migration (quando alterar models)
```powershell
cd backend
dotnet ef migrations add NomeDaMigration
dotnet ef database update
```

### Aplicar no Supabase
As migrations são aplicadas automaticamente no deploy se `DATABASE_URL` estiver configurado.

---

## 🔧 Supabase Dashboard

Acesse: https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx

**SQL Editor** - Para ver tables criadas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Table Editor** - Ver dados diretamente

---

## 🐛 Troubleshooting

### Erro: "password authentication failed"
```bash
# A senha tem @ no meio, precisa encoding
DATABASE_URL=postgresql://postgres:Hpn16%4012022@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
```

### Erro: "SSL connection required"
O código já adiciona `SSL Mode=Require;Trust Server Certificate=true` automaticamente.

### Dados não aparecem
Verifique nos logs se está usando PostgreSQL:
```
Using PostgreSQL in production  ← Deve aparecer isso
```

Se aparecer `Using SQLite`, a variável `DATABASE_URL` não foi lida corretamente.

---

## 📊 Vantagens do Supabase

✅ **Persistência permanente** - Dados não são apagados em deploy  
✅ **Backup automático** - Supabase faz backup diário  
✅ **Escalabilidade** - Suporta muito mais dados que SQLite  
✅ **Dashboard visual** - Interface web para gerenciar dados  
✅ **Row Level Security** - Segurança avançada (opcional)  
✅ **APIs automáticas** - Supabase gera APIs REST automaticamente  

---

## 🎯 Próximos Passos

1. ✅ Configurar `DATABASE_URL` no Render
2. ✅ Fazer deploy
3. ✅ Testar login e cadastro de alunos
4. ✅ Verificar persistência (dados devem permanecer após novo deploy)
