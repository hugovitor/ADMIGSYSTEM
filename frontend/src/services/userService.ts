import api from './api';

export interface UserDto {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  createdAt?: string;
  isActive?: boolean;
}

export const userService = {
  getAll: async (): Promise<UserDto[]> => {
    const response = await api.get<UserDto[]>('/users');
    return response.data;
  },

  getById: async (id: number): Promise<UserDto> => {
    const response = await api.get<UserDto>(`/users/${id}`);
    return response.data;
  },

  create: async (user: UserDto): Promise<UserDto> => {
    const response = await api.post<UserDto>('/users', user);
    return response.data;
  },

  update: async (id: number, user: UserDto): Promise<void> => {
    await api.put(`/users/${id}`, user);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
