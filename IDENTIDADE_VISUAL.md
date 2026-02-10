# Sistema de Gerenciamento de Igreja - Nova Identidade Visual! 🎨

## ✅ Atualizações Implementadas

### 🎨 Identidade Visual com Azul Escuro
- **Cor primária**: #0A1628 (Azul escuro profundo)
- **Cor secundária**: #3B82F6 (Azul vibrante accent)
- **Gradientes modernos** aplicados em login e dashboard
- **Sombras sutis** para profundidade visual

### 📱 Totalmente Responsivo
- Design adaptativo para **desktop, tablet e mobile**
- Breakpoints otimizados com Material UI
- Menu lateral responsivo (drawer temporário em mobile)
- Tipografia e espaçamentos ajustados por tamanho de tela
- Cards e botões com tamanhos adequados para cada dispositivo

### 🖼️ Logo no Login e Dashboard
- **Ícone de Igreja** como logo padrão
- Avatar circular com sombra no login
- Logo no cabeçalho do dashboard
- Logo na sidebar do sistema
- **Para adicionar seu próprio logo**: Veja instruções em `COMO_ADICIONAR_LOGO.md`

### 🎭 Melhorias Visuais

#### Página de Login
- Fundo com gradiente azul escuro → azul claro
- Card centralizado com sombra profunda
- Logo animado no topo
- Campos de input com hover effect
- Botão com gradiente e efeito de elevação
- Totalmente responsivo

#### Dashboard
- Header com gradiente e logo
- Cards dos módulos com:
  - Hover effect (elevação e animação)
  - Borda colorida no topo
  - Ícones com rotação sutil ao passar o mouse
  - Sombras suaves
- Card informativo sobre o sistema

#### Layout/Sidebar
- Sidebar azul escuro com logo
- Menu items com:
  - Hover effect suave
  - Estado selecionado destacado
  - Ícones alinhados
  - Transições suaves
- AppBar branco com logo e título
- Menu do usuário estilizado com gradiente

### 🎯 Tema Personalizado

```typescript
Cores:
- Primary Main: #0A1628 (Azul escuro)
- Primary Light: #1E3A5F
- Primary Dark: #050B14
- Secondary: #3B82F6 (Azul vibrante)
- Accent: #60A5FA
- Background: #F8FAFC
- Paper: #FFFFFF
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
```

### 📐 Componentes Customizados
- **Botões**: Sem texto em maiúsculas, bordas arredondadas, sombras no hover
- **Papers/Cards**: BorderRadius de 12px, sombras suaves
- **AppBar**: Sombra mínima para visual clean

## 🚀 Como Executar

### Backend
```bash
cd backend
dotnet run
```
Acesse: https://localhost:5001/swagger

### Frontend
```bash
cd frontend
npm run dev
```
Acesse: http://localhost:3000

## 🎨 Como Adicionar Seu Logo

Você tem 3 opções:

### Opção 1: Logo SVG (Recomendado)
Coloque seu arquivo SVG em: `frontend/public/logo.svg`

### Opção 2: Logo PNG
Coloque seu arquivo PNG em: `frontend/public/logo.png`

### Opção 3: Logo personalizado com código
Edite os arquivos:
- `src/pages/Login.tsx` (linha 64)
- `src/pages/Dashboard.tsx` (linha 46)
- `src/components/Layout.tsx` (linha 96)

Substitua o componente `<Church />` por:
```tsx
<img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%' }} />
```

## 📱 Responsividade

O sistema é **100% responsivo** e foi testado para:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (320px - 768px)

### Breakpoints Utilizados
- `xs`: 0px - 600px (mobile)
- `sm`: 600px - 960px (tablet)
- `md`: 960px - 1280px (laptop)
- `lg`: 1280px+ (desktop)

## 🎯 Funcionalidades Visuais

### Animações e Transições
- Fade in suave no login
- Hover effects nos cards
- Rotação de ícones ao passar o mouse
- Transições de cor suaves
- Elevação de elementos interativos

### Acessibilidade
- Contraste adequado entre texto e fundo
- Tamanhos de fonte legíveis
- Áreas de toque adequadas para mobile
- Estados visuais claros (hover, active, selected)

## 📦 Arquivos Criados/Modificados

✅ `frontend/src/App.tsx` - Tema Material UI customizado
✅ `frontend/src/pages/Login.tsx` - Nova UI com gradiente e logo
✅ `frontend/src/pages/Dashboard.tsx` - Cards modernos e responsivos
✅ `frontend/src/components/Layout.tsx` - Sidebar azul escuro com logo
✅ `frontend/src/theme/colors.ts` - Paleta de cores centralizada
✅ `frontend/public/logo.svg` - Placeholder do logo
✅ `COMO_ADICIONAR_LOGO.md` - Instruções para logo customizado

## 🎨 Preview da Identidade

**Login**: Gradiente azul escuro → azul claro com logo centralizado
**Dashboard**: Header azul com logo + cards com hover effect colorido
**Sidebar**: Azul escuro (#0A1628) com logo e menu items animados
**Theme**: Totalmente consistente em todas as páginas

## 📧 Credenciais Padrão
- Email: admin@igreja.com
- Senha: Admin@123

---

**Desenvolvido com ❤️ usando React, TypeScript e Material UI**
