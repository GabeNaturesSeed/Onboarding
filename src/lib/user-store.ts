// Multi-tenant user and credential store
// In production, replace with PostgreSQL/Prisma or similar

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string; // In production, use bcrypt
  createdAt: number;
  avatar?: string;
}

export interface UserSession {
  userId: string;
  token: string;
  expiresAt: number;
}

export interface UserPlatformConnections {
  userId: string;
  google?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    email: string;
    scopes: string[];
  };
  klaviyo?: {
    apiKey: string;
    companyName: string;
    connectedAt: number;
  };
  shopify?: {
    storeDomain: string;
    accessToken: string;
    connectedAt: number;
  };
  woocommerce?: {
    siteUrl: string;
    consumerKey: string;
    consumerSecret: string;
    connectedAt: number;
  };
  github?: {
    accessToken: string;
    username: string;
    avatarUrl: string;
    connectedAt: number;
  };
}

// Simple in-memory stores (replace with DB in production)
const users: Map<string, User> = new Map();
const sessions: Map<string, UserSession> = new Map();
const connections: Map<string, UserPlatformConnections> = new Map();

// --- Users ---

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function simpleHash(password: string): string {
  // NOT secure — use bcrypt in production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(36)}`;
}

export function createUser(email: string, name: string, password: string): User {
  const existing = Array.from(users.values()).find((u) => u.email === email);
  if (existing) throw new Error("Email already registered");

  const user: User = {
    id: generateId(),
    email,
    name,
    passwordHash: simpleHash(password),
    createdAt: Date.now(),
  };
  users.set(user.id, user);
  return user;
}

export function authenticateUser(email: string, password: string): User | null {
  const user = Array.from(users.values()).find((u) => u.email === email);
  if (!user) return null;
  if (user.passwordHash !== simpleHash(password)) return null;
  return user;
}

export function getUserById(id: string): User | null {
  return users.get(id) || null;
}

// --- Sessions ---

export function createSession(userId: string): UserSession {
  const session: UserSession = {
    userId,
    token: generateId() + generateId(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  sessions.set(session.token, session);
  return session;
}

export function getSessionByToken(token: string): UserSession | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export function deleteSession(token: string) {
  sessions.delete(token);
}

export function getUserFromToken(token: string): User | null {
  const session = getSessionByToken(token);
  if (!session) return null;
  return getUserById(session.userId);
}

// --- Platform Connections ---

export function getUserConnections(userId: string): UserPlatformConnections {
  if (!connections.has(userId)) {
    connections.set(userId, { userId });
  }
  return connections.get(userId)!;
}

export function updateUserConnection<K extends keyof Omit<UserPlatformConnections, "userId">>(
  userId: string,
  platform: K,
  data: UserPlatformConnections[K]
) {
  const conn = getUserConnections(userId);
  conn[platform] = data;
  connections.set(userId, conn);
}

export function removeUserConnection(
  userId: string,
  platform: keyof Omit<UserPlatformConnections, "userId">
) {
  const conn = getUserConnections(userId);
  delete conn[platform];
  connections.set(userId, conn);
}

export function getConnectionStatus(userId: string) {
  const conn = getUserConnections(userId);
  return {
    google: conn.google
      ? { connected: true, email: conn.google.email, scopes: conn.google.scopes }
      : { connected: false },
    klaviyo: conn.klaviyo
      ? { connected: true, companyName: conn.klaviyo.companyName }
      : { connected: false },
    shopify: conn.shopify
      ? { connected: true, storeDomain: conn.shopify.storeDomain }
      : { connected: false },
    woocommerce: conn.woocommerce
      ? { connected: true, siteUrl: conn.woocommerce.siteUrl }
      : { connected: false },
    github: conn.github
      ? { connected: true, username: conn.github.username, avatarUrl: conn.github.avatarUrl }
      : { connected: false },
  };
}
