import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthSession } from "@nextrep/domain";

const STORAGE_KEY = "nextrep-mobile-session";

export async function saveSession(session: AuthSession) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function refreshStoredSession(
  refreshFn: (refreshToken: string) => Promise<AuthSession>
): Promise<AuthSession | null> {
  const current = await loadSession();
  if (!current?.refreshToken) return null;
  const refreshed = await refreshFn(current.refreshToken);
  await saveSession(refreshed);
  return refreshed;
}
