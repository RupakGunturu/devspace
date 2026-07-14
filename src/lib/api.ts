const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

interface ApiOptions extends RequestInit {
  token?: string;
}

function getToken(): string | null {
  return localStorage.getItem("ds_token");
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const authToken = token || getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
  } catch (err) {
    throw new Error("Backend server is not reachable. Please make sure the server is running.");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

// ─── Auth API ───

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "local" | "google";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request<{ user: AuthUser }>("/api/auth/me"),

  updateProfile: (data: { name?: string; avatar?: string }) =>
    request<{ user: AuthUser }>("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    request<AuthResponse>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  getGoogleUrl: () => `${API_URL}/api/auth/google`,
};

// ─── Activity API ───

export interface GameScore {
  gameSlug: string;
  score: number;
  streak: number;
  accuracy: number;
  rank: string;
  playedAt: string;
}

export interface Favorite {
  type: "tool" | "tip" | "cheatsheet" | "game";
  slug: string;
  addedAt: string;
}

export interface SavedTip {
  tipId: string;
  savedAt: string;
}

export interface ActivityData {
  gameScores: GameScore[];
  toolUsage: { toolSlug: string; usedAt: string }[];
  savedTips: SavedTip[];
  favorites: Favorite[];
  recentlyUsed: { type: string; slug: string; usedAt: string }[];
}

export const activityApi = {
  get: () => request<ActivityData>("/api/activity"),

  saveGameScore: (data: { gameSlug: string; score: number; streak: number; accuracy: number; rank: string }) =>
    request<{ activity: ActivityData }>("/api/activity/game-score", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logToolUse: (toolSlug: string) =>
    request<{ message: string }>("/api/activity/tool-use", {
      method: "POST",
      body: JSON.stringify({ toolSlug }),
    }),

  toggleFavorite: (type: string, slug: string) =>
    request<{ isFavorited: boolean; favorites: Favorite[] }>("/api/activity/favorite", {
      method: "POST",
      body: JSON.stringify({ type, slug }),
    }),

  toggleSavedTip: (tipId: string) =>
    request<{ isSaved: boolean; savedTips: SavedTip[] }>("/api/activity/saved-tip", {
      method: "POST",
      body: JSON.stringify({ tipId }),
    }),

  removeFavorite: (type: string, slug: string) =>
    request<{ favorites: Favorite[] }>("/api/activity/favorite", {
      method: "DELETE",
      body: JSON.stringify({ type, slug }),
    }),
};
