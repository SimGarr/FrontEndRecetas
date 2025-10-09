import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as jwt_decode from 'jwt-decode'; // <-- import CommonJS

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    console.log('✅ Storage inicializado');
  }

  async setToken(token: string) {
    await this._storage?.set('token', token);
  }

  async getToken(): Promise<string | null> {
    return await this._storage?.get('token');
  }

  async removeToken() {
    await this._storage?.remove('token');
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    try {
      const decoded: any = (jwt_decode as any).default(token); // <-- uso .default
      const exp = decoded.exp * 1000;
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  async getUserRole(): Promise<string | null> {
    const token = await this.getToken();
    if (!token) return null;

    try {
      const decoded: any = (jwt_decode as any).default(token); // <-- uso .default
      return decoded.rol || null;
    } catch {
      return null;
    }
  }
}
