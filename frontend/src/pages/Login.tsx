import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Church } from '@mui/icons-material';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de campos obrigatórios
    if (!email.trim()) {
      setError('Por favor, informe seu email');
      return;
    }
    
    if (!password.trim()) {
      setError('Por favor, informe sua senha');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        name: response.name,
        email: response.email,
        role: response.role,
      }));
      navigate('/');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Email ou senha incorretos. Verifique suas credenciais e tente novamente.');
      } else if (err.response?.status === 403) {
        setError('Sua conta está inativa. Entre em contato com o administrador.');
      } else if (err.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A1628 0%, #1E3A5F 50%, #3B82F6 100%)',
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              margin: '0 auto',
              bgcolor: 'white',
              boxShadow: '0 8px 32px rgba(10, 22, 40, 0.3)',
              mb: 2,
            }}
          >
            <Church sx={{ fontSize: { xs: 50, sm: 60 }, color: theme.palette.primary.main }} />
          </Avatar>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              color: 'white', 
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            ADMIGVIPI SYSTEM
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 300,
              mt: 1,
            }}
          >
            Assembleia de Deus Ministério do Gusrá  Em Vicente Pires
          </Typography>
        </Box>

        <Paper 
          elevation={10} 
          sx={{ 
            p: { xs: 3, sm: 4 },
            borderRadius: 0,
            boxShadow: '0 20px 60px rgba(10, 22, 40, 0.4)',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              label="Senha"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <Box 
            sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: '1px solid #E2E8F0',
              textAlign: 'center',
            }}
          >
            {/* <Typography variant="caption" color="text.secondary" display="block">
              Credenciais padrão
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
              <strong>admin@igreja.com</strong> / <strong>Admin@123</strong>
            </Typography> */}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
