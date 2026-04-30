const COOKIE_ACCESS = "nextrep_access_token";
const COOKIE_REFRESH = "nextrep_refresh_token";

export function setAuthCookies(accessToken: string, refreshToken: string | null) {
  document.cookie = `${COOKIE_ACCESS}=${encodeURIComponent(accessToken)}; Path=/; SameSite=Lax`;
  document.cookie = `${COOKIE_REFRESH}=${encodeURIComponent(refreshToken ?? "")}; Path=/; SameSite=Lax`;
}

export function clearAuthCookies() {
  document.cookie = `${COOKIE_ACCESS}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${COOKIE_REFRESH}=; Path=/; Max-Age=0; SameSite=Lax`;
}
