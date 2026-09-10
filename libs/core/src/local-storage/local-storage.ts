import { Service } from '@angular/core';

import { LocalStorageValue } from './types/local-storage-value';

@Service()
export class LocalStorage {
  private readonly localStorage = localStorage;

  exists(key: string): boolean {
    return !!this.get(key);
  }

  get<T>(key: string): T | null {
    const value = this.localStorage.getItem(key);
    if (value === null) return null;
    return JSON.parse(value);
  }

  set(key: string, value: LocalStorageValue): void {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  clear(): void {
    this.localStorage.clear();
  }

  remove(key: string): void {
    this.localStorage.removeItem(key);
  }
}
