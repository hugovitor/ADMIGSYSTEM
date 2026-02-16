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

export interface MusicSchoolPreRegistration {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  instrument: string;
  level: string;
  preferredClassType: string;
  preferredSchedule?: string;
  hasMusicalExperience: boolean;
  musicalExperience?: string;
  questions?: string;
  preRegistrationDate: string;
  status: string;
  contactDate?: string;
  adminNotes?: string;
  isProcessed: boolean;
}

export interface UpdatePreRegistrationRequest {
  status: string;
  adminNotes?: string;
  isProcessed: boolean;
}

export interface ConvertPreRegistrationRequest {
  teacher?: string;
  classSchedule?: string;
  monthlyFee: number;
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

  // Endpoints para gerenciar pré-matrículas
  getPreRegistrations: async (): Promise<MusicSchoolPreRegistration[]> => {
    const response = await api.get<MusicSchoolPreRegistration[]>('/musicschool/pre-registrations');
    return response.data;
  },

  updatePreRegistration: async (id: number, data: UpdatePreRegistrationRequest): Promise<void> => {
    await api.put(`/musicschool/pre-registrations/${id}`, data);
  },

  convertPreRegistration: async (id: number, data: ConvertPreRegistrationRequest): Promise<MusicSchoolStudent> => {
    const response = await api.post<MusicSchoolStudent>(`/musicschool/pre-registrations/${id}/convert`, data);
    return response.data;
  },
};
