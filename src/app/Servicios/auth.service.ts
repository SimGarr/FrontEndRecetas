import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { NativeBiometric } from 'capacitor-native-biometric';
import { DatabaseService } from './database.service';

export interface BiometricCredentials {
  token: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private email: string | null = null;

  constructor(
    private router: Router,
    private dbService: DatabaseService
  ) {}

  async init() {
    const sesiones = await this.dbService.obtenerSesiones();
    if (sesiones.length > 0) {
      this.email = sesiones[0].email;
      this.token = sesiones[0].token;
      console.log('🔐 Sesión restaurada desde SQLite:', this.email);
    } else {
      console.log('👋 No hay sesión guardada en SQLite');
    }
  }

  async setToken(token: string, email: string) {
    await this.dbService.borrarSesiones();
    await this.dbService.guardarSesion(email, token);
    this.token = token;
    this.email = email;
    console.log('✅ Token guardado en SQLite:', email);
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    const sesiones = await this.dbService.obtenerSesiones();
    return sesiones.length > 0 ? sesiones[0].token : null;
  }

async removeToken() {
  console.log('🚪 Cerrando sesión...');
  await this.dbService.borrarSesiones(); // Limpia sesión de SQLite
  this.token = null;
  this.email = null;
  console.log('✅ Sesión cerrada, credenciales biométricas conservadas');
}


  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000;
      const valid = Date.now() < exp;
      if (!valid) await this.removeToken();
      return valid;
    } catch {
      await this.removeToken();
      return false;
    }
  }

  // --- Autenticación biométrica ---
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const result = await NativeBiometric.isAvailable();
      return result.isAvailable;
    } catch {
      return false;
    }
  }

  async saveBiometricCredentials(email: string, token: string): Promise<void> {
    const available = await this.isBiometricAvailable();
    if (!available) return;

    await NativeBiometric.setCredentials({
      username: email,
      password: JSON.stringify({ email, token }),
      server: 'sabores-app'
    });
    console.log('✅ Credenciales biométricas guardadas');
  }

  async getBiometricCredentials(): Promise<BiometricCredentials | null> {
    try {
      const credentials = await NativeBiometric.getCredentials({ server: 'sabores-app' });
      return credentials.password ? JSON.parse(credentials.password) : null;
    } catch {
      return null;
    }
  }

  async removeBiometricCredentials(): Promise<void> {
    try {
      await NativeBiometric.deleteCredentials({ server: 'sabores-app' });
    } catch {}
  }

async authenticateWithBiometric(): Promise<BiometricCredentials | null> {
  const available = await this.isBiometricAvailable();
  if (!available) throw new Error('not available');

  const saved = await this.getBiometricCredentials();
  if (!saved) throw new Error('No hay credenciales guardadas');

  try {
    const result: any = await NativeBiometric.verifyIdentity({
      reason: 'Verifica tu identidad para ingresar',
      title: 'Autenticación biométrica',
      subtitle: 'Usa tu huella o rostro'
    });

    console.log('📲 Resultado biométrico:', result);

    // Algunos Android devuelven undefined o {} aunque haya sido correcta
    if (result?.verified || result?.success || result === true || result === undefined) {
      console.log('✅ Identidad verificada correctamente');
      return saved;
    } else {
      throw new Error('canceled');
    }

  } catch (error: any) {
    if (error?.message?.includes('cancel') || error?.code === 'UserCancel') {
      console.warn('🛑 Usuario canceló la autenticación');
      throw new Error('canceled');
    } else if (error?.message?.includes('No Biometric enrolled')) {
      throw new Error('not enrolled');
    } else {
      console.error('❌ Error en verificación biométrica:', error);
      throw new Error('biometric error');
    }
  }
}



  async getUserRole(): Promise<string | null> {
    const token = await this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.rol || null;
    } catch {
      return null;
    }
  }

  async redirectAfterLogin() {
    const isLoggedIn = await this.isLoggedIn();
    if (isLoggedIn) this.router.navigateByUrl('/recetas', { replaceUrl: true });
  }
}