import api from './api';

export interface MusicSchoolStudent {
  id?: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  parentName?: string;
  parentPhone?: string;
  instrument: string;
  level: string;
  teacher?: string;
  classType: string;
  classSchedule?: string;
  monthlyFee: number;
  paymentStatus: string;
  lastPaymentDate?: string;
  enrollmentDate?: string;
  isActive?: boolean;
  status: string;
  notes?: string;
  progress?: string;
  totalClasses: number;
  attendedClasses: number;
}

export interface MusicSchoolStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  studentsByInstrument: { [key: string]: number };
  studentsByLevel: { [key: string]: number };
  studentsByPaymentStatus: { [key: string]: number };
  totalMonthlyRevenue: number;
  studentsWithPendingPayment: number;
}

export const musicSchoolService = {
  getAll: async (): Promise<MusicSchoolStudent[]> => {
    const response = await api.get<MusicSchoolStudent[]>('/musicschool');
    return response.data;
  },

  getById: async (id: number): Promise<MusicSchoolStudent> => {
    const response = await api.get<MusicSchoolStudent>(`/musicschool/${id}`);
    return response.data;
  },

  create: async (student: MusicSchoolStudent): Promise<MusicSchoolStudent> => {
    const response = await api.post<MusicSchoolStudent>('/musicschool', student);
    return response.data;
  },

  update: async (id: number, student: MusicSchoolStudent): Promise<void> => {
    await api.put(`/musicschool/${id}`, student);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/musicschool/${id}`);
  },

  getStats: async (): Promise<MusicSchoolStats> => {
    const response = await api.get<MusicSchoolStats>('/musicschool/stats');
    return response.data;
  },

  registerPayment: async (id: number): Promise<void> => {
    await api.post(`/musicschool/${id}/payment`);
  },

  registerAttendance: async (id: number): Promise<void> => {
    await api.post(`/musicschool/${id}/attendance`);
  },
};
