// Frontend Client types

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email?: string;
  adresse: string;
  datePermis: string;
  status: "Actif" | "Inactif" | "Suspendu";
  numeroPermis?: string;
  lieuNaissance?: string;
  nationalite?: string;
  profession?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientForm {
  nom: string;
  prenom: string;
  dateNaissance: string;
  telephone: string;
  email?: string;
  adresse: string;
  datePermis: string;
  status?: "Actif" | "Inactif" | "Suspendu";
  numeroPermis?: string;
  lieuNaissance?: string;
  nationalite?: string;
  profession?: string;
}

export type UpdateClientForm = Partial<CreateClientForm>;

export interface ClientListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientStatsResponse {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  suspendedClients: number;
  statusBreakdown: Array<{
    status: "Actif" | "Inactif" | "Suspendu";
    count: number;
  }>;
  recentClients: number;
  clientsWithEmail: number;
  clientsWithoutEmail: number;
}

export interface ClientSearchResult {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  status: "Actif" | "Inactif" | "Suspendu";
}

// Convert backend status to frontend status
export const mapBackendStatusToFrontend = (status: 'ACTIF' | 'INACTIF' | 'SUSPENDU'): "Actif" | "Inactif" | "Suspendu" => {
  const statusMap = {
    'ACTIF': 'Actif' as const,
    'INACTIF': 'Inactif' as const,
    'SUSPENDU': 'Suspendu' as const
  };
  return statusMap[status];
};

// Convert frontend status to backend status
export const mapFrontendStatusToBackend = (status: "Actif" | "Inactif" | "Suspendu"): 'ACTIF' | 'INACTIF' | 'SUSPENDU' => {
  const statusMap = {
    'Actif': 'ACTIF' as const,
    'Inactif': 'INACTIF' as const,
    'Suspendu': 'SUSPENDU' as const
  };
  return statusMap[status];
};

// Convert backend client to frontend client
export const mapBackendClientToFrontend = (backendClient: any): Client => {
  return {
    id: backendClient.id,
    nom: backendClient.nom,
    prenom: backendClient.prenom,
    dateNaissance: backendClient.dateNaissance,
    telephone: backendClient.telephone,
    email: backendClient.email,
    adresse: backendClient.adresse,
    datePermis: backendClient.datePermis,
    status: mapBackendStatusToFrontend(backendClient.status),
    numeroPermis: backendClient.numeroPermis,
    lieuNaissance: backendClient.lieuNaissance,
    nationalite: backendClient.nationalite,
    profession: backendClient.profession,
    isActive: backendClient.isActive,
    createdAt: backendClient.createdAt,
    updatedAt: backendClient.updatedAt
  };
};

// Convert frontend client form to backend format
export const mapFrontendFormToBackend = (formData: CreateClientForm | UpdateClientForm): any => {
  const backendData: any = { ...formData };
  
  if (formData.status) {
    backendData.status = mapFrontendStatusToBackend(formData.status);
  }
  
  return backendData;
};