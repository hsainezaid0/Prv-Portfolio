// localStorage can throw (private browsing, blocked cookies), so every access is wrapped.
export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore: the preference just won't be remembered.
    }
  },
};

// sessionStorage: remembered until the tab is closed (used to play the intro once per visit).
export const session = {
  get(key: string): string | null {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): void {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Ignore.
    }
  },
};
