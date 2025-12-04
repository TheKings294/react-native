import { getAuthToken } from './authStorage';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

type JsonMap = Record<string, unknown>;

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
    const message =
      (data as JsonMap | null)?.error ||
      (data as JsonMap | null)?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(String(message));
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
