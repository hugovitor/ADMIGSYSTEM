# 🚨 INSTRUÇÕES PARA CORRIGIR ERRO CORS

## O Backend está funcionando ✅
- ✅ URL: `https://church-management-backend-7owp.onrender.com/api`  
- ✅ Login testado e funcionando
- ✅ Retorna token JWT corretamente

## Problema Identificado ❌
O Vercel não está lendo o arquivo `.env.production` automaticamente. Precisa configurar as variáveis de ambiente diretamente no painel.

## SOLUÇÃO URGENTE (5 minutos):

### 1. Acesse o Painel do Vercel
- Abra: https://vercel.com/dashboard
- Entre na sua conta
- Clique no projeto `admigsystem`

### 2. Configure as Variáveis de Ambiente
- Clique na aba **"Settings"**
- Clique em **"Environment Variables"**  
- Adicione uma nova variável:
  - **Name**: `VITE_API_BASE_URL`
  - **Value**: `https://church-management-backend-7owp.onrender.com/api`
  - **Environments**: Production ✅ Preview ✅ Development ✅

### 3. Force Redeploy
- Vá para aba **"Deployments"**
- Clique nos 3 pontos no deployment mais recente
- Clique **"Redeploy"**

## SOLUÇÃO ALTERNATIVA (Imediata):

Se não quiser mexer no Vercel agora, force o backend no código:

1. Edite `frontend/src/services/api.ts`
2. Substitua a função `getApiBaseUrl()` por:
```javascript
const getApiBaseUrl = () => {
  return 'https://church-management-backend-7owp.onrender.com/api';
};
```

3. Faça commit e push - Vercel atualizará em 1-2 minutos

## Status Atual:
- 🟢 Backend: Funcionando
- 🟡 Frontend: Aguardando configuração do Vercel  
- 🟡 CORS: Configurado corretamente no backend
- 🔴 Variáveis de Ambiente: Não configuradas no Vercel

**A solução alternativa é mais rápida se você quiser testar agora!**