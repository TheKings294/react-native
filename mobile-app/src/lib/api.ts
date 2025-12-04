import { getAuthToken } from './authStorage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

type JsonMap = Record<string, unknown>;

function resolveErrorMessage(data: unknown, status: number) {
  if (!data) return `Request failed with status ${status}`;
  if (typeof data === 'string') return data;
  if (typeof data === 'object') {
    const maybeError = (data as JsonMap).error;
    const maybeMessage = (data as JsonMap).message;
    const maybeErrors = (data as JsonMap).errors;
    if (typeof maybeError === 'string') return maybeError;
    if (typeof maybeMessage === 'string') return maybeMessage;
    if (typeof maybeErrors === 'string') return maybeErrors;
    return JSON.stringify(data);
  }
  return String(data);
}

async function apiPost<T>(path: string, body: JsonMap, authToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(data, response.status));
  }

  return data as T;
}

async function apiPut<T>(path: string, body: JsonMap, authToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(data, response.status));
  }

  return data as T;
}

async function apiPatch<T>(path: string, body: JsonMap, authToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(data, response.status));
  }

  return data as T;
}

async function apiGet<T>(path: string, authToken?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(resolveErrorMessage(data, response.status));
  }

  return data as T;
}

export type LoginResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    displayName?: string | null;
    avatar?: string | null;
    bio?: string | null;
    isProfilePublic?: boolean | null;
    lastLoginAt?: string | null;
    token: string;
  };
};

export type RegisterResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    displayName?: string | null;
    createdAt?: string | null;
  };
};

export function login(email: string, password: string) {
  return apiPost<LoginResponse>('/api/auth/login', { email, password });
}

export function register(payload: {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  bio?: string;
  isProfilePublic?: boolean;
}) {
  return apiPost<RegisterResponse>('/api/auth/register', payload);
}

export async function apiPostWithAuth<T>(path: string, body: JsonMap) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Utilisateur non authentifié.');
  }
  return apiPost<T>(path, body, token);
}

export type UpdateUserProfilePayload = {
  username?: string | null;
  displayName?: string | null;
  bio?: string | null;
  avatar?: string | null;
  isProfilePublic?: boolean | null;
};

export async function updateUserProfile(payload: UpdateUserProfilePayload) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Utilisateur non authentifié.');
  }
  return apiPut<{ message: string }>('/api/user/update', payload, token);
}

export async function updateUserPassword(payload: { oldPassword: string; newPassword: string }) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Utilisateur non authentifié.');
  }
  return apiPatch<{ message: string }>('/api/user/update-password', payload, token);
}

export async function createRoadbook(payload: {
  title: string;
  description?: string | null;
  coverImage?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  countries?: string[];
  tags?: string[];
  isPublished?: boolean;
  isPublic?: boolean;
  template?: string;
  theme?: string | null;
  places?: number[];
}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Utilisateur non authentifié.');
  }
  return apiPost('/api/roadbooks', payload, token);
}

export async function getRoadbooks() {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Utilisateur non authentifié.');
  }
  return apiGet<RoadbookResponse[]>('/api/roadbooks', token);
}

export type RoadbookResponse = {
  id: number;
  userId: number;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  countries?: string[] | null;
  tags?: string[] | null;
  isPublished?: boolean | null;
  isPublic?: boolean | null;
  template?: string | null;
  theme?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  viewCount?: number | null;
  favoriteCount?: number | null;
  places?: unknown[];
};
