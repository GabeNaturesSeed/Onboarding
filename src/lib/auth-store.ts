// In-memory auth store (in production, use a database)
// This module stores OAuth tokens and API keys server-side

export interface GoogleAuth {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
  scopes: string[];
}

export interface KlaviyoAuth {
  apiKey: string;
  companyName: string;
  connectedAt: number;
}

interface AuthStore {
  google: GoogleAuth | null;
  klaviyo: KlaviyoAuth | null;
}

// Server-side singleton
const store: AuthStore = {
  google: null,
  klaviyo: null,
};

export function getGoogleAuth(): GoogleAuth | null {
  return store.google;
}

export function setGoogleAuth(auth: GoogleAuth) {
  store.google = auth;
}

export function clearGoogleAuth() {
  store.google = null;
}

export function getKlaviyoAuth(): KlaviyoAuth | null {
  return store.klaviyo;
}

export function setKlaviyoAuth(auth: KlaviyoAuth) {
  store.klaviyo = auth;
}

export function clearKlaviyoAuth() {
  store.klaviyo = null;
}

export function getAuthStatus() {
  return {
    google: store.google
      ? { connected: true, email: store.google.email, scopes: store.google.scopes }
      : { connected: false },
    klaviyo: store.klaviyo
      ? { connected: true, companyName: store.klaviyo.companyName }
      : { connected: false },
  };
}
