import api from './api';

export interface MensGroupMember {
  id?: number;
  name: string;
  email: string;
  phone: string;
  joinDate?: string;
  isActive?: boolean;
  role?: string;
  notes?: string;
}

export const mensGroupService = {
  getAll: async (): Promise<MensGroupMember[]> => {
    const response = await api.get<MensGroupMember[]>('/mensgroup');
    return response.data;
  },

  getById: async (id: number): Promise<MensGroupMember> => {
    const response = await api.get<MensGroupMember>(`/mensgroup/${id}`);
    return response.data;
  },

  create: async (member: MensGroupMember): Promise<MensGroupMember> => {
    const response = await api.post<MensGroupMember>('/mensgroup', member);
    return response.data;
  },

  update: async (id: number, member: MensGroupMember): Promise<void> => {
    await api.put(`/mensgroup/${id}`, member);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/mensgroup/${id}`);
  },
};
