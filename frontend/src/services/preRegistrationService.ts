import api from './api';

export interface MusicSchoolPreRegistrationRequest {
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
}

export interface MusicSchoolPreRegistrationResponse {
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

export const preRegistrationService = {
  async createMusicSchoolPreRegistration(data: MusicSchoolPreRegistrationRequest): Promise<{ message: string; data: MusicSchoolPreRegistrationResponse }> {
    const response = await api.post('/preregistration/music-school', data);
    return response.data;
  },

  async getAvailableInstruments(): Promise<{ instruments: string[] }> {
    const response = await api.get('/preregistration/music-school/instruments');
    return response.data;
  },

  async getAvailableLevels(): Promise<{ levels: string[] }> {
    const response = await api.get('/preregistration/music-school/levels');
    return response.data;
  },

  async getAvailableClassTypes(): Promise<{ classTypes: string[] }> {
    const response = await api.get('/preregistration/music-school/class-types');
    return response.data;
  }
};