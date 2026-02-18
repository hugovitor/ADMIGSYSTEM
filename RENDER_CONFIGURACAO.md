# 🚀 Como Configurar Supabase no Render.com

## Passo a Passo com Imagens

### 1️⃣ Acessar Dashboard do Render

1. Acesse: https://dashboard.render.com
2. Faça login com sua conta
3. Você verá a lista de seus serviços

---

### 2️⃣ Selecionar o Serviço Backend

1. Procure pelo serviço do backend (provavelmente chamado `church-management-backend` ou similar)
2. Clique no nome do serviço para abrir

---

### 3️⃣ Ir para Environment Variables

Na página do serviço:

1. **Clique na aba "Environment"** no menu lateral esquerdo
2. Você verá a seção **"Environment Variables"**

---

### 4️⃣ Adicionar DATABASE_URL

#### Se DATABASE_URL NÃO existe:

1. Clique no botão **"Add Environment Variable"**
2. Preencha:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres`
3. Clique em **"Save Changes"**

#### Se DATABASE_URL JÁ existe:

1. Encontre a variável `DATABASE_URL` na lista
2. Clique no ícone de **lápis (✏️)** ou **"Edit"**
3. Substitua o valor antigo por:
   ```
   postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
   ```
4. Clique em **"Save Changes"**

---

### 5️⃣ (Opcional) Adicionar Variáveis de Controle

Se quiser, adicione estas variáveis de controle:

| Key | Value | Descrição |
|-----|-------|-----------|
| `RESET_DATABASE` | `false` | Não resetar banco ao iniciar |
| `FORCE_DB_CREATE` | `false` | Não forçar recriação do banco |

**Como adicionar:**
1. Clique em **"Add Environment Variable"** para cada uma
2. Preencha Key e Value
3. Clique em **"Save Changes"**

---

### 6️⃣ Deploy Automático

Após salvar as variáveis:

1. O Render detectará a mudança
2. Pode aparecer um banner perguntando se quer fazer deploy
3. Clique em **"Yes, deploy"** ou aguarde o deploy automático

**OU** Force o deploy manualmente:
1. Vá na aba **"Manual Deploy"**
2. Clique em **"Deploy latest commit"**

---

### 7️⃣ Verificar Logs

Enquanto o deploy acontece:

1. Clique na aba **"Logs"** no menu lateral
2. Acompanhe os logs em tempo real
3. Procure por estas mensagens de sucesso:

```
============================================================
🔧 Environment: Production
🔧 DATABASE_URL exists: True
🐘 Database: PostgreSQL
🌐 Host: db.hnegqsgcabjroprpjzxx.supabase.co
============================================================
Running migrations...
Database setup completed successfully.
Database seeding completed.
Admin user created successfully!
```

---

### 8️⃣ Testar a API

Depois do deploy:

1. Copie a URL do seu backend (ex: `https://church-management-backend-7owp.onrender.com`)
2. Teste o login:

```powershell
$backend = "https://church-management-backend-7owp.onrender.com"
$body = @{ email = "admin@igreja.com"; password = "Admin@123" } | ConvertTo-Json
Invoke-RestMethod -Uri "$backend/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

Se retornar um token JWT, está funcionando! 🎉

---

## ⚠️ Problemas Comuns

### Erro: "DATABASE_URL not found"

**Causa:** A variável não foi salva corretamente

**Solução:**
1. Volte em **Environment**
2. Verifique se `DATABASE_URL` está na lista
3. Se não estiver, adicione novamente
4. Clique em **"Save Changes"** e aguarde o deploy

---

### Erro: "password authentication failed"

**Causa:** Senha incorreta na connection string

**Solução:**
1. Confirme a senha no Supabase: https://supabase.com/dashboard/project/hnegqsgcabjroprpjzxx/settings/database
2. Atualize a variável `DATABASE_URL` com a senha correta
3. Se a senha tiver caracteres especiais (`@`, `#`, etc.), use URL encoding:
   - `@` = `%40`
   - `#` = `%23`

---

### Continua tentando usar banco local

**Causa:** DATABASE_URL não está configurada

**O que fazer:**
1. Verifique nos logs se aparece: `🐘 Database: PostgreSQL (Supabase)`
2. Se der erro "DATABASE_URL environment variable is required", a variável não está configurada
3. Verifique:
   - Nome exato: `DATABASE_URL` (maiúsculas)
   - Valor completo copiado corretamente
   - Clicou em "Save Changes"

---

### Deploy não inicia automaticamente

**Solução:**
1. Vá em **Manual Deploy**
2. Clique em **"Deploy latest commit"**
3. Ou faça um novo commit no GitHub para trigger automático:
   ```powershell
   git commit --allow-empty -m "Trigger deploy"
   git push origin main
   ```

---

## 📸 Localizações Importantes no Render

```
Dashboard Render
├── [Seu Serviço Backend]
│   ├── Overview (visão geral, URL)
│   ├── Environment ⭐ (aqui você adiciona DATABASE_URL)
│   ├── Logs (ver logs de deploy e runtime)
│   ├── Manual Deploy (forçar deploy)
│   ├── Settings (configurações gerais)
│   └── Metrics (uso de recursos)
```

---

## ✅ Checklist Final

- [ ] DATABASE_URL adicionada no Render
- [ ] FORCE_SQLITE=false configurado
- [ ] Deploy concluído sem erros
- [ ] Logs mostram "🐘 Database: PostgreSQL"
- [ ] Logs mostram "Database setup completed successfully"
- [ ] Login funciona: admin@igreja.com / Admin@123
- [ ] Dados criados permanecem após novo deploy

---

## 🎯 Resumo Rápido

**Connection String para copiar:**
```
postgresql://postgres:AnaniaseDindinha@db.hnegqsgcabjroprpjzxx.supabase.co:5432/postgres
```

**Onde adicionar:**
Render Dashboard → Seu Backend → **Environment** → **Add Environment Variable**

**Credenciais Admin:**
- Email: `admin@igreja.com`
- Senha: `Admin@123`

---

## 💡 Dica Pro

Depois de configurar, você pode testar cadastrando um aluno na escola de música e fazendo um novo deploy. Se o aluno continuar cadastrado após o deploy, significa que o Supabase está funcionando perfeitamente! 🎉
