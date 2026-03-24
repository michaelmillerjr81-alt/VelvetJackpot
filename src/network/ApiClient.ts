import type { SpinResult, CurrencyMode } from '../types/index.ts';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface SpinPayload {
  bet: number;
  currency: CurrencyMode;
}

export const apiClient = {
  async spin(payload: SpinPayload): Promise<SpinResult> {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/spin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error((err as { message: string }).message);
    }
    return res.json() as Promise<SpinResult>;
  },

  async getBalance(): Promise<{ gc: number; sc: number }> {
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/balance`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch balance');
    return res.json() as Promise<{ gc: number; sc: number }>;
  },
};
