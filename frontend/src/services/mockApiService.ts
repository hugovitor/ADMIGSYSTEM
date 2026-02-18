// Mock API para simular dados reais enquanto as APIs do backend são desenvolvidas
export const mockApiService = {
  // Simular resposta da API de música
  async getMusicSchoolData() {
    // Simular dados que viriam da API real /api/musicschool
    const mockData = [
      { id: 1, name: 'João Silva', instrument: 'Piano', level: 'Intermediário' },
      { id: 2, name: 'Maria Santos', instrument: 'Violão', level: 'Iniciante' },
      { id: 3, name: 'Pedro Costa', instrument: 'Bateria', level: 'Avançado' },
      { id: 4, name: 'Ana Oliveira', instrument: 'Teclado', level: 'Intermediário' },
      { id: 5, name: 'Carlos Pereira', instrument: 'Baixo', level: 'Iniciante' },
      // ... mais alunos simulados
    ];
    
    // Simular diferentes cenários baseados na hora
    const hour = new Date().getHours();
    const baseCount = 45;
    const variation = Math.floor(Math.sin(hour / 24 * Math.PI * 2) * 10);
    const totalStudents = baseCount + variation;
    
    // Retornar dados no formato que a API real retornaria
    return Array.from({ length: totalStudents }, (_, i) => ({
      id: i + 1,
      name: `Aluno ${i + 1}`,
      instrument: ['Piano', 'Violão', 'Bateria', 'Teclado', 'Baixo', 'Canto'][i % 6],
      level: ['Iniciante', 'Intermediário', 'Avançado'][i % 3],
      registrationDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    }));
  },

  // Simular resposta da API de jiu-jitsu
  async getJiuJitsuData() {
    const hour = new Date().getHours();
    const baseCount = 25;
    const variation = Math.floor(Math.cos(hour / 24 * Math.PI * 2) * 5);
    const totalAthletes = baseCount + variation;
    
    return Array.from({ length: totalAthletes }, (_, i) => ({
      id: i + 1,
      name: `Atleta ${i + 1}`,
      belt: ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'][Math.floor(i / 5) % 5],
      graduationDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      active: true
    }));
  },

  // Simular resposta da API de membros
  async getMembersData() {
    const hour = new Date().getHours();
    const day = new Date().getDate();
    const baseCount = 150;
    const variation = Math.floor((Math.sin(day / 30 * Math.PI * 2) + Math.cos(hour / 24 * Math.PI * 2)) * 15);
    const totalMembers = baseCount + variation;
    
    return Array.from({ length: totalMembers }, (_, i) => ({
      id: i + 1,
      name: `Membro ${i + 1}`,
      email: `membro${i + 1}@admig.com`,
      phone: `(61) 9${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      joinDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      active: true
    }));
  },

  // Função principal para buscar todos os dados simulados
  async getAllRealData() {
    try {
      const [musicData, jiujitsuData, membersData] = await Promise.all([
        this.getMusicSchoolData(),
        this.getJiuJitsuData(),
        this.getMembersData()
      ]);

      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Calcular crescimentos baseados em dados "reais" simulados
      const musicGrowth = Math.max(1, Math.floor((musicData.length - 42) / 42 * 100));
      const jiujitsuGrowth = Math.max(1, Math.floor((jiujitsuData.length - 23) / 23 * 100));
      const weekGrowth = Math.max(0.1, (membersData.length - 145) / 145 * 100);

      return {
        music: {
          total: musicData.length,
          data: musicData,
          growth: musicGrowth,
          newThisMonth: Math.floor(Math.random() * 8) + 2
        },
        jiujitsu: {
          total: jiujitsuData.length,
          data: jiujitsuData,
          growth: jiujitsuGrowth,
          newThisMonth: Math.floor(Math.random() * 5) + 1
        },
        members: {
          total: membersData.length,
          data: membersData,
          weekGrowth: Math.abs(weekGrowth),
          newThisWeek: Math.floor(Math.random() * 5) + 1
        },
        general: {
          todayEvents: 2,
          activeMinistries: 8,
          lastUpdated: now.toISOString()
        }
      };
    } catch (error) {
      console.error('Erro ao simular dados reais:', error);
      throw error;
    }
  }
};