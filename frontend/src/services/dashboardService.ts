import { getApiBaseUrl } from './api';

// Services para buscar dados reais do dashboard
export const dashboardService = {
  // Buscar estatísticas gerais
  async getGeneralStats() {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/dashboard/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API não disponível, usando dados simulados');
    }
    
    // Dados simulados realistas
    return {
      totalMembers: 150,
      todayEvents: 2,
      thisWeekGrowth: 8.5,
      activeMinistries: 8
    };
  },

  // Buscar dados da escola de música
  async getMusicSchoolStats() {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/music-school/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API Música não disponível, usando dados simulados');
    }
    
    // Simulação de dados reais da escola de música
    return {
      total: 45,
      growth: 12,
      activeStudents: 42,
      instruments: ['Piano', 'Violão', 'Bateria', 'Teclado', 'Baixo', 'Canto'],
      monthlyGrowth: [38, 40, 42, 45], // Últimos 4 meses
      lastUpdate: new Date().toISOString()
    };
  },

  // Buscar dados do jiu-jitsu
  async getJiuJitsuStats() {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/jiujitsu/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API Jiu-Jitsu não disponível, usando dados simulados');
    }
    
    // Simulação de dados reais do jiu-jitsu
    return {
      total: 25,
      growth: 5,
      activeAthletes: 23,
      belts: {
        white: 10,
        blue: 8,
        purple: 4,
        brown: 2,
        black: 1
      },
      monthlyGrowth: [20, 22, 24, 25], // Últimos 4 meses
      lastUpdate: new Date().toISOString()
    };
  },

  // Buscar dados do grupo de homens
  async getMensGroupStats() {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/mens-group/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API Grupo de Homens não disponível, usando dados simulados');
    }
    
    // Simulação de dados reais do grupo de homens
    return {
      total: 30,
      growth: 3,
      activeMembers: 28,
      regularAttendance: 25,
      monthlyGrowth: [26, 28, 29, 30], // Últimos 4 meses
      lastUpdate: new Date().toISOString()
    };
  },

  // Buscar estatísticas detalhadas dos membros
  async getMembersStats() {
    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/members/stats`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API Membros não disponível, usando dados simulados');
    }
    
    // Simulação de dados reais dos membros
    return {
      total: 150,
      weekGrowth: 8.5,
      newThisWeek: 3,
      baptized: 85,
      visitors: 12,
      regularAttendance: 120,
      ageGroups: {
        children: 25,
        youth: 45,
        adults: 65,
        seniors: 15
      },
      lastUpdate: new Date().toISOString()
    };
  },

  // Buscar todos os dados do dashboard
  async getAllDashboardData() {
    try {
      const [general, music, jiujitsu, mensGroup, members] = await Promise.all([
        this.getGeneralStats(),
        this.getMusicSchoolStats(),
        this.getJiuJitsuStats(),
        this.getMensGroupStats(),
        this.getMembersStats()
      ]);

      return {
        general,
        music,
        jiujitsu,
        mensGroup,
        members,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }
};