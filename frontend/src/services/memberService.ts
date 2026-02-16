import api from './api';

export interface Member {
  id?: number;
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  gender: string;
  maritalStatus: string;
  profession?: string;
  education?: string;
  photoPath?: string;
  email: string;
  phone: string;
  alternativePhone?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  membershipDate: string;
  membershipType: string;
  baptismStatus?: string;
  baptismDate?: string;
  baptismLocation?: string;
  previousChurch?: string;
  ministry?: string;
  cellGroup?: string;
  leadershipPosition?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export interface MemberDetail extends Member {
  isActive: boolean;
  familyMembers: FamilyMember[];
  age?: number;
}

export interface FamilyMember {
  id?: number;
  memberId: number;
  name: string;
  relationship: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  isChurchMember: boolean;
  churchMemberId?: number;
  notes?: string;
  age?: number;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  membershipTypes: MembershipTypeDistribution;
  genderDistribution: GenderDistribution;
  ageGroups: AgeGroupDistribution;
  maritalStatus: MaritalStatusDistribution;
  baptismStats: BaptismStats;
  membersWithFamily: number;
  totalFamilyMembers: number;
}

export interface MembershipTypeDistribution {
  visitante: number;
  congregado: number;
  membro: number;
  diacono: number;
  presbitero: number;
  pastor: number;
}

export interface GenderDistribution {
  masculino: number;
  feminino: number;
  naoInformado: number;
}

export interface AgeGroupDistribution {
  children: number;
  teens: number;
  youngAdults: number;
  adults: number;
  seniors: number;
  unknown: number;
}

export interface MaritalStatusDistribution {
  solteiro: number;
  casado: number;
  divorciado: number;
  viuvo: number;
}

export interface BaptismStats {
  naoBatizado: number;
  batizadoAguas: number;
  batizadoEspirito: number;
  ambos: number;
}

export const memberService = {
  // CRUD básico
  getAll: async (includeInactive: boolean = false): Promise<Member[]> => {
    const response = await api.get<Member[]>(`/members?includeInactive=${includeInactive}`);
    return response.data;
  },

  getById: async (id: number): Promise<MemberDetail> => {
    const response = await api.get<MemberDetail>(`/members/${id}`);
    return response.data;
  },

  create: async (member: Member): Promise<Member> => {
    const response = await api.post<Member>('/members', member);
    return response.data;
  },

  update: async (id: number, member: Member): Promise<void> => {
    await api.put(`/members/${id}`, member);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/members/${id}`);
  },

  // Upload de foto
  uploadPhoto: async (id: number, photo: File): Promise<{ photoPath: string }> => {
    const formData = new FormData();
    formData.append('photo', photo);
    
    const response = await api.post<{ photoPath: string }>(`/members/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Estatísticas
  getStats: async (): Promise<MemberStats> => {
    const response = await api.get<MemberStats>('/members/stats');
    return response.data;
  },

  // Gestão de familiares
  addFamilyMember: async (memberId: number, familyMember: FamilyMember): Promise<FamilyMember> => {
    const response = await api.post<FamilyMember>(`/members/${memberId}/family`, familyMember);
    return response.data;
  },

  updateFamilyMember: async (memberId: number, familyId: number, familyMember: FamilyMember): Promise<void> => {
    await api.put(`/members/${memberId}/family/${familyId}`, familyMember);
  },

  removeFamilyMember: async (memberId: number, familyId: number): Promise<void> => {
    await api.delete(`/members/${memberId}/family/${familyId}`);
  },
};