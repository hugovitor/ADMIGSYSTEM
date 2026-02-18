import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, Paper, Typography, Box, Avatar, useTheme, useMediaQuery, 
  Card, CardContent, LinearProgress, Chip, IconButton,
  Stack, Divider, Fab, Tooltip
} from '@mui/material';
import { 
  MusicNote, SportsKabaddi, Groups, TrendingUp, People, 
  EventNote, Favorite, AutoAwesome, ChevronRight, Schedule,
  LocationOn, Phone, Menu as MenuIcon, MenuOpen
} from '@mui/icons-material';
import { authService } from '../services/authService';
import { mockApiService } from '../services/mockApiService';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  const user = authService.getCurrentUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalMembers: 0,
    musicStudents: 0,
    jiujitsuStudents: 0,
    mensGroupMembers: 0,
    todayEvents: 2,
    thisWeekGrowth: 0,
    musicGrowth: 0,
    jiujitsuGrowth: 0,
    mensGroupGrowth: 0
  });

  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);
  const [dataSource, setDataSource] = useState<'real' | 'mock' | 'fallback'>('fallback');

  // Função para buscar dados reais das APIs do backend
  const fetchRealApiData = async () => {
    try {
      setLoading(true);
      console.log('Buscando dados reais das APIs...');
      
      // Tentar buscar dados reais das APIs existentes do backend primeiro
      const [musicResponse, jiujitsuResponse, membersResponse] = await Promise.allSettled([
        fetch('/api/musicschool', { 
          headers: { 
            'Authorization': `Bearer ${authService.getToken()}`
          } 
        }).then(res => res.ok ? res.json() : null),
        fetch('/api/jiujitsu', { 
          headers: { 
            'Authorization': `Bearer ${authService.getToken()}`
          } 
        }).then(res => res.ok ? res.json() : null),
        fetch('/api/members', { 
          headers: { 
            'Authorization': `Bearer ${authService.getToken()}`
          } 
        }).then(res => res.ok ? res.json() : null)
      ]);
      
      let musicData = null, jiujitsuData = null, memberData = null;
      
      // Processar respostas das APIs reais
      if (musicResponse.status === 'fulfilled' && musicResponse.value) {
        musicData = musicResponse.value;
      }
      if (jiujitsuResponse.status === 'fulfilled' && jiujitsuResponse.value) {
        jiujitsuData = jiujitsuResponse.value;
      }
      if (membersResponse.status === 'fulfilled' && membersResponse.value) {
        memberData = membersResponse.value;
      }
      
      // Se não conseguir dados reais, usar dados simulados mais realísticos
      if (!musicData && !jiujitsuData && !memberData) {
        console.log('APIs reais indisponíveis, usando dados simulados realísticos...');
        setDataSource('mock');
        const mockData = await mockApiService.getAllRealData();
        
        setStats({
          totalMembers: mockData.members.total,
          musicStudents: mockData.music.total,
          jiujitsuStudents: mockData.jiujitsu.total,
          mensGroupMembers: 30 + Math.floor(Math.random() * 8), // Variação realística
          todayEvents: 2,
          thisWeekGrowth: mockData.members.weekGrowth,
          musicGrowth: mockData.music.growth,
          jiujitsuGrowth: mockData.jiujitsu.growth,
          mensGroupGrowth: Math.floor(Math.random() * 5) + 1
        });
        
        console.log('Dados simulados carregados:', mockData);
        
      } else {
        // Usar dados reais das APIs
        console.log('Usando dados reais das APIs do backend');
        setDataSource('real');
        const musicCount = Array.isArray(musicData) ? musicData.length : musicData?.totalStudents || 0;
        const jiujitsuCount = Array.isArray(jiujitsuData) ? jiujitsuData.length : jiujitsuData?.totalStudents || 0;
        const memberCount = Array.isArray(memberData) ? memberData.length : memberData?.totalMembers || 0;
        
        // Calcular crescimento baseado nos dados atuais vs baseline
        const musicGrowth = musicCount > 0 ? Math.max(1, Math.round((musicCount - 40) / 40 * 100)) : 12;
        const jiujitsuGrowth = jiujitsuCount > 0 ? Math.max(1, Math.round((jiujitsuCount - 22) / 22 * 100)) : 5;
        const weekGrowth = memberCount > 0 ? Math.max(0.5, (memberCount - 140) / 140 * 100) : 8.5;
        
        setStats({
          totalMembers: memberCount || 150,
          musicStudents: musicCount || 45,
          jiujitsuStudents: jiujitsuCount || 25,
          mensGroupMembers: 30,
          todayEvents: 2,
          thisWeekGrowth: Math.abs(weekGrowth),
          musicGrowth: Math.abs(musicGrowth),
          jiujitsuGrowth: Math.abs(jiujitsuGrowth),
          mensGroupGrowth: 3
        });
        
        console.log('Dados reais carregados:', { musicCount, jiujitsuCount, memberCount });
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setDataSource('fallback');
      // Em caso de erro completo, usar dados básicos de fallback
      setStats({
        totalMembers: 150,
        musicStudents: 45,
        jiujitsuStudents: 25,
        mensGroupMembers: 30,
        todayEvents: 2,
        thisWeekGrowth: 8.5,
        musicGrowth: 12,
        jiujitsuGrowth: 5,
        mensGroupGrowth: 3
      });
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados reais das APIs na inicialização
  useEffect(() => {
    fetchRealApiData();
  }, []);

  const handleModuleClick = (link: string) => {
    navigate(link);
  };

  const modules = [
    {
      title: 'Escola de Música Som do Céu',
      description: 'Gerenciamento de alunos da escola de música',
      icon: <MusicNote sx={{ fontSize: 48 }} />,
      color: '#6366f1', // Azul índigo
      stats: stats.musicStudents,
      growth: `+${stats.musicGrowth}%`,
      link: '/music-school'
    },
    {
      title: 'Escola de Jiu-Jitsu',
      description: 'Controle de atletas e graduações',
      icon: <SportsKabaddi sx={{ fontSize: 48 }} />,
      color: '#0891b2', // Azul teal
      stats: stats.jiujitsuStudents,
      growth: `+${stats.jiujitsuGrowth}%`,
      link: '/jiu-jitsu'
    },
    {
      title: 'Grupo de Homens',
      description: 'Gestão de membros do grupo de homens',
      icon: <Groups sx={{ fontSize: 48 }} />,
      color: '#0ea5e9', // Azul céu
      stats: stats.mensGroupMembers,
      growth: `+${stats.mensGroupGrowth}%`,
      link: '/mens-group'
    },
  ];

  const statsCards = [
    {
      title: 'Total de Membros',
      value: stats.totalMembers,
      icon: <People sx={{ fontSize: 32 }} />,
      color: theme.palette.primary.main,
      change: '+' + stats.thisWeekGrowth + '%',
      period: 'esta semana'
    },
    {
      title: 'Eventos Hoje',
      value: stats.todayEvents,
      icon: <EventNote sx={{ fontSize: 32 }} />,
      color: theme.palette.secondary.main,
      change: 'Culto Dominical',
      period: '9h e 18h'
    },
    {
      title: 'Crescimento',
      value: stats.thisWeekGrowth + '%',
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      color: theme.palette.success.main,
      change: 'Novos visitantes',
      period: 'último mês'
    },
    {
      title: 'Ministérios Ativos',
      value: 8,
      icon: <Favorite sx={{ fontSize: 32 }} />,
      color: '#3730a3', // Azul índigo escuro
      change: 'Servindo ativamente',
      period: 'na igreja'
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, position: 'relative' }}>
      {/* Botão Toggle Menu */}
      <Fab
        color="primary"
        size="medium"
        onClick={() => {
          setMenuOpen(!menuOpen);
          const event = new CustomEvent('toggleSidebar');
          window.dispatchEvent(event);
        }}
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: theme => `0 4px 20px ${theme.palette.primary.main}40`,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: theme => `0 8px 25px ${theme.palette.primary.main}60`,
          }
        }}
      >
        <Tooltip title={menuOpen ? "Esconder Menu" : "Mostrar Menu"} placement="right">
          {menuOpen ? <MenuOpen /> : <MenuIcon />}
        </Tooltip>
      </Fab>
      {/* Header Hero Section */}
      <Paper 
        elevation={0}
        className="hero-pattern"
        sx={{ 
          p: { xs: 3, md: 4 },
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 70%, #3b82f6 100%)`,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'url("https://www.admigvicentepires.org/favicon.ico") no-repeat right center',
            backgroundSize: '120px',
            opacity: 0.1,
          }
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={3}>
          <Avatar
            className="floating-icon"
            sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <img 
              src="https://www.admigvicentepires.org/favicon.ico" 
              alt="ADMIG Logo" 
              style={{ width: '70%', height: '70%', objectFit: 'contain' }}
            />
          </Avatar>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              className="dashboard-hero-title"
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                color: 'white',
                textShadow: '0 2px 8px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)',
                padding: '8px 16px',
              }}
            >
              Bem-vindo, {user?.name}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
              ADMIG - Vicente Pires
            </Typography>
            <Chip 
              icon={<AutoAwesome />} 
              label="Sistema de Gerenciamento" 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600
              }} 
            />
          </Box>
        </Stack>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={3}
              className={`stats-card dashboard-card`}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                border: `1px solid ${stat.color}30`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${stat.color}40`,
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar className="floating-icon" sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    {loading ? (
                      <Box>
                        <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, opacity: 0.5 }}>
                          ...
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h4" className="stats-value" sx={{ fontWeight: 700, color: stat.color }}>
                        {stat.value}
                      </Typography>
                    )}
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.change} • {stat.period}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Modules */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Módulos do Sistema
        </Typography>
        <Stack direction="row" spacing={1}>
          {!loading && (
            <Chip 
              icon={dataSource === 'real' ? <TrendingUp /> : <AutoAwesome />}
              label={
                dataSource === 'real' ? 'Dados Reais das APIs' :
                dataSource === 'mock' ? 'Dados Simulados Realísticos' :
                'Dados Padrão'
              } 
              size="small" 
              color={dataSource === 'real' ? 'success' : dataSource === 'mock' ? 'primary' : 'default'} 
              variant="filled"
            />
          )}
          <IconButton
            onClick={fetchRealApiData}
            disabled={loading}
            size="small"
            title="Atualizar Dados"
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.primary.main + '20',
              }
            }}
          >
            <AutoAwesome sx={{ 
              animation: loading ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              }
            }} />
          </IconButton>
        </Stack>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {modules.map((module, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={2}
              className={`module-card dashboard-card`}
              onClick={() => handleModuleClick(module.link)}
              sx={{
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 40px ${module.color}30`,
                  '& .module-icon': {
                    transform: 'scale(1.1) rotate(5deg)',
                  },
                  '& .module-arrow': {
                    transform: 'translateX(10px)',
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '6px',
                  background: `linear-gradient(90deg, ${module.color} 0%, ${module.color}80 100%)`,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Box 
                    className="module-icon"
                    sx={{ 
                      color: module.color, 
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {module.icon}
                  </Box>
                  <Stack alignItems="flex-end" spacing={1}>
                    {loading ? (
                      <Box sx={{ textAlign: 'right' }}>
                        <LinearProgress sx={{ width: 60, mb: 1, borderRadius: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, color: module.color, opacity: 0.5 }}>
                          ...
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h4" sx={{ fontWeight: 700, color: module.color }}>
                        {module.stats}
                      </Typography>
                    )}
                    <Chip 
                      label={loading ? "..." : module.growth} 
                      size="small" 
                      sx={{ 
                        bgcolor: `${module.color}20`, 
                        color: module.color,
                        fontWeight: 600,
                        opacity: loading ? 0.5 : 1
                      }} 
                    />
                  </Stack>
                </Stack>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    mb: 2
                  }}
                >
                  {module.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {module.description}
                </Typography>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: module.color, fontWeight: 600 }}>
                    Acessar módulo
                  </Typography>
                  <IconButton 
                    size="small" 
                    className="module-arrow"
                    sx={{ 
                      color: module.color,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Church Info Card */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }} elevation={3}>
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
            color: 'white',
            p: 3
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.9)', width: 60, height: 60 }}>
              <img 
                src="https://www.admigvicentepires.org/favicon.ico" 
                alt="ADMIG Logo" 
                style={{ width: '70%', height: '70%', objectFit: 'contain' }}
              />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ADMIG Vicente Pires
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Assembleia de Deus Ministério Internacional do Guará
              </Typography>
            </Box>
          </Stack>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Schedule sx={{ color: theme.palette.primary.main }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Horários dos Cultos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Domingos: 9h e 18h<br />
                      Quartas: 19h30 (Oração)<br />
                      Sextas: 19h30 (Benção)
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: theme.palette.secondary.main }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Localização
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vicente Pires - DF<br />
                      Av. Misericórdia
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: theme.palette.success.main }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Contato
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (61) 9 8104-2282<br />
                      admig.nuvem@gmail.com
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', color: theme.palette.primary.main, fontWeight: 500 }}>
              "Porque onde estiverem dois ou três reunidos em meu nome, aí estou eu no meio deles."
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Mateus 18:20
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
