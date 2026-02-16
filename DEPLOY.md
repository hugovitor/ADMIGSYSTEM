# 🚀 Deploy da Aplicação Church Management System

## 📋 Pré-requisitos
- Conta no [Render](https://render.com) 
- Conta no [Vercel](https://vercel.com)
- Git configurado

## 🔧 Deploy do Backend (Render)

### 1. Configurar no Render:
1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em "New +" e selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `church-management-backend`
   - **Environment**: `Docker`
   - **Root Directory**: `backend`
   - **Dockerfile**: `Dockerfile` (já criado)

### 2. Variáveis de Ambiente no Render:
```bash
# Obrigatórias
DATABASE_URL=<seu_postgre_url_aqui>  # Render fornece automaticamente
ASPNETCORE_ENVIRONMENT=Production
PORT=10000

# JWT (substitua pelos valores desejados)
JwtSettings__SecretKey=KTJPv8jTQGKi8bgGyPYk1YqfOVg3jF3TtWgdcTmstZpFgWeRXLzSHOKlYMFgY2Ky
JwtSettings__Issuer=ChurchManagementAPI
JwtSettings__Audience=ChurchManagementUsers
```

### 3. Build Commands (Render):
- **Build Command**: `./build.sh`
- **Start Command**: `./start.sh`

## 🌐 Deploy do Frontend (Vercel)

### 1. Deploy via Vercel CLI ou Dashboard:

#### Via Dashboard:
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique "New Project"
3. Conecte seu repositório GitHub  
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Via CLI:
```bash
cd frontend
npx vercel --prod
```

### 2. Variáveis de Ambiente no Vercel:
```bash
VITE_API_URL=https://church-management-backend.onrender.com/api
```

## 🔗 Configuração Final

1. **Após o deploy do backend**, copie a URL do Render
2. **Atualize a variável `VITE_API_URL`** no Vercel com a URL real
3. **Atualize `AllowedOrigins`** no `appsettings.Production.json` com a URL do Vercel
4. **Redeployar o backend** no Render

## 📱 URLs Finais
- **Frontend**: `https://seu-app.vercel.app`
- **Backend API**: `https://seu-app.onrender.com/api`
- **Formulário Público**: `https://seu-app.onrender.com/preregistration.html`
- **Swagger**: `https://seu-app.onrender.com/swagger`

## ⚠️ Notas Importantes
- **Render free tier**: Hiberna após 15min de inatividade
- **PostgreSQL**: Render oferece PostgreSQL gratuito com alguns limites
- **CORS**: Configurado automaticamente para desenvolvimento e produção
- **SSL**: Ambos Render e Vercel oferecem HTTPS automático

## 🔍 Troubleshooting
1. **API não conecta**: Verifique `VITE_API_URL` no Vercel
2. **CORS Error**: Atualize `AllowedOrigins` no backend
3. **Database Error**: Verifique `DATABASE_URL` no Render
4. **Build Error**: Confirme que todas as dependências estão no `package.json`