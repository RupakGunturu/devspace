export interface RememberedAccount {
  name: string;
  email: string;
  avatar?: string;
  provider?: string;
}

const STORAGE_KEY = "ds_last_user";

export function saveLastAccount(account: RememberedAccount | null): void {
  if (!account) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      name: account.name,
      email: account.email,
      avatar: account.avatar,
      provider: account.provider,
    }),
  );
}

export function getLastAccount(): RememberedAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    return {
      name: parsed.name,
      email: parsed.email,
      avatar: parsed.avatar,
      provider: parsed.provider,
    };
  } catch {
    return null;
  }
}

export function clearLastAccount(): void {
  localStorage.removeItem(STORAGE_KEY);
}
