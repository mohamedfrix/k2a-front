// API utilities for review operations (admin + public)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API error');
  }
  return data.data as T;
};

export interface ReviewListItem {
  id: string;
  name: string;
  email?: string | null;
  message: string;
  isPublic: boolean;
  adminNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResponse {
  reviews: ReviewListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getReviews = async (token: string, page = 1, limit = 20): Promise<ReviewListResponse> => {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_BASE_URL}/reviews?${q.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleApiResponse<ReviewListResponse>(res);
};

export const getReviewById = async (id: string, token: string): Promise<ReviewListItem> => {
  const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  return handleApiResponse<ReviewListItem>(res);
};

export const updateReview = async (
  id: string,
  data: Partial<Pick<ReviewListItem, 'isPublic' | 'adminNote'>>,
  token: string
): Promise<ReviewListItem> => {
  const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  return handleApiResponse<ReviewListItem>(res);
};

export const getPublicReviews = async (limit = 6): Promise<ReviewListItem[]> => {
  const q = new URLSearchParams({ limit: String(limit) });
  const res = await fetch(`${API_BASE_URL}/reviews/public?${q.toString()}`, {
    method: 'GET',
  });
  return handleApiResponse<ReviewListItem[]>(res);
};
