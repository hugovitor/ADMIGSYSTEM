import api from './api';

export interface JiuJitsuStudent {
  id?: number;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  belt: string;
  stripes?: number;
  lastPromotionDate?: string;
  enrollmentDate?: string;
  isActive?: boolean;
  monthlyFee?: number;
  lastPaymentDate?: string;
  paymentStatus?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  healthConditions?: string;
  notes?: string;
}

export interface JiuJitsuStudentDetail extends JiuJitsuStudent {
  graduations?: JiuJitsuGraduation[];
  recentAttendances?: JiuJitsuAttendance[];
  recentPayments?: JiuJitsuPayment[];
  age?: number;
}

export interface JiuJitsuGraduation {
  id: number;
  fromBelt: string;
  toBelt: string;
  fromStripes: number;
  toStripes: number;
  graduationDate: string;
  graduatedBy?: string;
  notes?: string;
}

export interface CreateGraduation {
  studentId: number;
  toBelt: string;
  toStripes?: number;
  graduationDate?: string;
  graduatedBy?: string;
  notes?: string;
}

export interface JiuJitsuAttendance {
  id: number;
  date: string;
  classType: string;
  isPresent: boolean;
  notes?: string;
}

export interface CreateAttendance {
  studentId: number;
  date?: string;
  classType?: string;
  isPresent: boolean;
  notes?: string;
}

export interface BulkAttendance {
  date?: string;
  classType?: string;
  students: StudentAttendance[];
}

export interface StudentAttendance {
  studentId: number;
  isPresent: boolean;
  notes?: string;
}

export interface JiuJitsuPayment {
  id: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  referenceMonth: string;
  notes?: string;
}

export interface CreatePayment {
  studentId: number;
  paymentDate?: string;
  amount: number;
  paymentMethod?: string;
  referenceMonth?: string;
  notes?: string;
}

export interface JiuJitsuStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  beltDistribution: BeltDistribution;
  paymentStats: PaymentStats;
  ageGroups: AgeGroups;
  totalMonthlyRevenue: number;
  totalGraduationsThisYear: number;
  attendanceRate: AttendanceRate;
}

export interface BeltDistribution {
  branca: number;
  azul: number;
  roxa: number;
  marrom: number;
  preta: number;
}

export interface PaymentStats {
  emDia: number;
  atrasado: number;
  inadimplente: number;
  totalReceived: number;
  totalPending: number;
}

export interface AgeGroups {
  kids: number;
  teens: number;
  adults: number;
  seniors: number;
  unknown: number;
}

export interface AttendanceRate {
  overallRate: number;
  lastWeekRate: number;
  lastMonthRate: number;
}

export const jiuJitsuService = {
  // CRUD básico
  getAll: async (includeInactive: boolean = false): Promise<JiuJitsuStudent[]> => {
    const response = await api.get<JiuJitsuStudent[]>(`/jiujitsu?includeInactive=${includeInactive}`);
    return response.data;
  },

  getById: async (id: number): Promise<JiuJitsuStudentDetail> => {
    const response = await api.get<JiuJitsuStudentDetail>(`/jiujitsu/${id}`);
    return response.data;
  },

  create: async (student: JiuJitsuStudent): Promise<JiuJitsuStudent> => {
    const response = await api.post<JiuJitsuStudent>('/jiujitsu', student);
    return response.data;
  },

  update: async (id: number, student: JiuJitsuStudent): Promise<void> => {
    await api.put(`/jiujitsu/${id}`, student);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/jiujitsu/${id}`);
  },

  // Estatísticas
  getStats: async (): Promise<JiuJitsuStats> => {
    const response = await api.get<JiuJitsuStats>('/jiujitsu/stats');
    return response.data;
  },

  // Graduações
  createGraduation: async (graduation: CreateGraduation): Promise<JiuJitsuGraduation> => {
    const response = await api.post<JiuJitsuGraduation>(
      `/jiujitsu/${graduation.studentId}/graduations`, 
      graduation
    );
    return response.data;
  },

  getStudentGraduations: async (studentId: number): Promise<JiuJitsuGraduation[]> => {
    const response = await api.get<JiuJitsuGraduation[]>(`/jiujitsu/${studentId}/graduations`);
    return response.data;
  },

  // Presença
  createAttendance: async (attendance: CreateAttendance): Promise<void> => {
    await api.post('/jiujitsu/attendance', attendance);
  },

  createBulkAttendance: async (bulkAttendance: BulkAttendance): Promise<void> => {
    await api.post('/jiujitsu/attendance/bulk', bulkAttendance);
  },

  getStudentAttendance: async (
    studentId: number, 
    startDate?: string, 
    endDate?: string
  ): Promise<JiuJitsuAttendance[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get<JiuJitsuAttendance[]>(
      `/jiujitsu/${studentId}/attendance?${params.toString()}`
    );
    return response.data;
  },

  // Pagamentos
  createPayment: async (payment: CreatePayment): Promise<JiuJitsuPayment> => {
    const response = await api.post<JiuJitsuPayment>(
      `/jiujitsu/${payment.studentId}/payments`, 
      payment
    );
    return response.data;
  },

  getStudentPayments: async (studentId: number): Promise<JiuJitsuPayment[]> => {
    const response = await api.get<JiuJitsuPayment[]>(`/jiujitsu/${studentId}/payments`);
    return response.data;
  },
};
