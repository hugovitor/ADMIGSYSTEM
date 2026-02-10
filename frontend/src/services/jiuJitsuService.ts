import api from './api';

export interface JiuJitsuStudent {
  id?: number;
  name: string;
  email: string;
  phone: string;
  belt: string;
  enrollmentDate?: string;
  isActive?: boolean;
  notes?: string;
}

export const jiuJitsuService = {
  getAll: async (): Promise<JiuJitsuStudent[]> => {
    const response = await api.get<JiuJitsuStudent[]>('/jiujitsu');
    return response.data;
  },

  getById: async (id: number): Promise<JiuJitsuStudent> => {
    const response = await api.get<JiuJitsuStudent>(`/jiujitsu/${id}`);
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
};
