import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export async function setAuthToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearAuthToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function setAuthUser(user: unknown) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getAuthUser<T>() {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    return null;
  }
}

export async function clearAuthUser() {
  await SecureStore.deleteItemAsync(USER_KEY);
}
