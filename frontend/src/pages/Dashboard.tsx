import React from 'react';
import { Grid, Paper, Typography, Box, Avatar, useTheme, useMediaQuery, Card, CardContent } from '@mui/material';
import { MusicNote, SportsKabaddi, Groups, Church } from '@mui/icons-material';
import { authService } from '../services/authService';

const Dashboard: React.FC = () => {
  const user = authService.getCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const modules = [
    {
      title: 'Escola de Música',
      description: 'Gerenciamento de alunos da escola de música',
      icon: <MusicNote sx={{ fontSize: 48 }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Escola de Jiu-Jitsu',
      description: 'Controle de atletas e graduações',
      icon: <SportsKabaddi sx={{ fontSize: 48 }} />,
      color: theme.palette.success.main,
    },
    {
      title: 'Grupo de Homens',
      description: 'Gestão de membros do grupo de homens',
      icon: <Groups sx={{ fontSize: 48 }} />,
      color: theme.palette.warning.main,
    },
  ];

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 3, md: 4 },
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          color: 'white',
          borderRadius: 0,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: { xs: 60, md: 80 },
            height: { xs: 60, md: 80 },
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <Church sx={{ fontSize: { xs: 35, md: 45 }, color: theme.palette.primary.main }} />
        </Avatar>
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700, mb: 0.5 }}>
            Bem-vindo, {user?.name}!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Sistema de Gerenciamento da ADMIGVIPI
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(10, 22, 40, 0.2)',
                  '& .module-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: module.color,
                },
              }}
            >
              <CardContent sx={{ 
                textAlign: 'center', 
                p: { xs: 3, md: 4 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <Box 
                  className="module-icon"
                  sx={{ 
                    color: module.color, 
                    mb: 2,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {module.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {module.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 4, borderRadius: 0 }} elevation={2}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <Church />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sobre o Sistema
            </Typography>
          </Box>
          <Typography variant="body1" paragraph color="text.secondary">
            Este sistema foi desenvolvido para facilitar o gerenciamento das atividades da igreja,
            proporcionando uma interface moderna e intuitiva para organização de dados.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use o menu lateral para navegar entre os diferentes módulos e gerenciar suas atividades.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
