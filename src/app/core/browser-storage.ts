import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BrowserStorage {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Quota or private-mode failures should not crash the app.
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage access errors.
    }
  }

  readJson<T>(key: string, fallback: T): T {
    const raw = this.getItem(key);
    if (!raw) {
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
}
