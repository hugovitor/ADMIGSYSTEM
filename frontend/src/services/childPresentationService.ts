import api from './api';

export interface ChildPresentation {
  id?: number;
  childName: string;
  birthDate: string;
  gender: string;
  birthPlace?: string;
  fatherName: string;
  fatherProfession?: string;
  motherName: string;
  motherProfession?: string;
  presentationDate: string;
  pastor: string;
  biblicalVerse?: string;
  specialMessage?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  churchName: string;
  churchAddress?: string;
  notes?: string;
  ageInMonths?: number;
  certificateGenerated?: boolean;
}

export interface ChildPresentationDetail extends ChildPresentation {
  certificateGenerated: boolean;
  certificatePath?: string;
  createdAt: string;
  isActive: boolean;
}

export interface GenerateCertificate {
  childPresentationId: number;
  customChurchName?: string;
  customChurchAddress?: string;
  customBiblicalVerse?: string;
  customMessage?: string;
  customPastor?: string;
}

export interface ChildPresentationStats {
  totalPresentations: number;
  presentationsThisYear: number;
  presentationsThisMonth: number;
  genderStats: GenderStats;
  ageStats: AgeStats;
  monthlyStats: MonthlyStats;
  certificatesGenerated: number;
  pendingCertificates: number;
}

export interface GenderStats {
  boys: number;
  girls: number;
}

export interface AgeStats {
  under1Year: number;
  age1to2: number;
  age3to5: number;
  over5Years: number;
}

export interface MonthlyStats {
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}

export const childPresentationService = {
  // CRUD básico
  getAll: async (includeInactive: boolean = false): Promise<ChildPresentation[]> => {
    const response = await api.get<ChildPresentation[]>(`/childpresentation?includeInactive=${includeInactive}`);
    return response.data;
  },

  getById: async (id: number): Promise<ChildPresentationDetail> => {
    const response = await api.get<ChildPresentationDetail>(`/childpresentation/${id}`);
    return response.data;
  },

  create: async (presentation: ChildPresentation): Promise<ChildPresentation> => {
    const response = await api.post<ChildPresentation>('/childpresentation', presentation);
    return response.data;
  },

  update: async (id: number, presentation: ChildPresentation): Promise<void> => {
    await api.put(`/childpresentation/${id}`, presentation);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/childpresentation/${id}`);
  },

  // Estatísticas
  getStats: async (): Promise<ChildPresentationStats> => {
    const response = await api.get<ChildPresentationStats>('/childpresentation/stats');
    return response.data;
  },

  // Geração de certificado
  generateCertificate: async (id: number, customData?: Omit<GenerateCertificate, 'childPresentationId'>): Promise<{ certificatePath: string }> => {
    const response = await api.post<{ certificatePath: string }>(`/childpresentation/${id}/certificate`, customData);
    return response.data;
  },

  // Download de certificado
  downloadCertificate: async (id: number): Promise<Blob> => {
    const response = await api.get(`/childpresentation/${id}/certificate/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};