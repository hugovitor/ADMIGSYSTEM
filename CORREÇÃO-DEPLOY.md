# 🆘 CORREÇÃO URGENTE: Erro de Deploy "no such table: Users"

## ✅ **SOLUÇÃO RÁPIDA** (Para aplicar AGORA):

### **SOLUÇÃO IMEDIATA**: Force SQLite (Mais confiável)  
1. Vá para `church-management-backend-7owp`
2. **Environment** → **Add Environment Variable**  
3. Adicione AMBAS as variáveis:
   - **Name**: `FORCE_SQLITE` | **Value**: `true`
   - **Name**: `FORCE_DB_CREATE` | **Value**: `true`  
4. **Se existir `DATABASE_URL`**: **DELETE** temporariamente para evitar confusão
5. **Save Changes**

**Resultado**: SQLite funcionando em 2 minutos! 🚀

### **DEPOIS (Opcional)**: Migrar para PostgreSQL
1. Remova `FORCE_SQLITE` e `FORCE_DB_CREATE` 
2. Crie PostgreSQL no Render (New + → PostgreSQL)
3. Configure `DATABASE_URL` com a External Connection String
4. Adicione `RESET_DATABASE=true` temporariamente

## 🔄 **Após o sucesso**:
**IMPORTANTE**: Remova a variável `FORCE_DB_CREATE` após confirmar que funciona, para não recriar o banco sempre.

## 🛠️ **O que foi corrigido**:
1. ✅ Program.cs agora usa `EnsureCreated()` como fallback
2. ✅ DbInitializer mais robusto com tratamento de erros  
3. ✅ Build script melhorado
4. ✅ Documentação de troubleshooting atualizada

## 🐘 **Recomendação para estabilidade**:
Para evitar problemas futuros, use **PostgreSQL** do Render:

1. **Criar PostgreSQL database**:
   - No Render: New + → PostgreSQL
   - Escolha o plano Free
   - Depois de criado, copie a **External Connection String**

2. **Atualizar seu Web Service**:
   - Environment → Edit `DATABASE_URL` 
   - Cole a connection string do PostgreSQL
   - Save Changes

O PostgreSQL é mais estável que SQLite em ambientes como Docker/Render.

## 📱 **URLs do seu app**:
- **API**: `https://church-management-backend.onrender.com/api`
- **Swagger**: `https://church-management-backend.onrender.com/swagger`
- **Formulário**: `https://church-management-backend.onrender.com/preregistration.html`

**Login padrão após correção**:
- Email: `admin@igreja.com`
- Senha: `Admin@123`