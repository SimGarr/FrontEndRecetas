import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'https://apprecetas.duckdns.org/api/usuarios';

  constructor(private http: HttpClient) {}

  // Registro de usuario
  createUsuario(userData: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }


  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password };
    
    console.log('📤 Enviando login a:', `${this.apiUrl}/login`);
    
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      body,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    ).pipe(
      map((response: any) => {
        console.log('📥 Respuesta del servidor:', response);
        
        if (response && response.token) {
          console.log('✅ Token recibido correctamente');
          return { token: response.token } as AuthResponse;
        }
        
        throw new Error('Token no recibido del servidor');
      }),
      catchError(error => {
        console.error('❌ Error en servicio login:', error);
        return throwError(() => this.handleLoginError(error));
      })
    );
  }


  private handleLoginError(error: any): any {
    if (error.status === 401) {
      return { 
        status: 401, 
        message: 'Credenciales incorrectas' 
      };
    } else if (error.status === 404) {
      return { 
        status: 404, 
        message: 'Usuario no encontrado' 
      };
    } else if (error.status === 0) {
      return { 
        status: 0, 
        message: 'No se puede conectar al servidor' 
      };
    } else {
      return {
        status: error.status || 500,
        message: error.error?.message || error.message || 'Error desconocido'
      };
    }
  }

  // 🗑️ Manejo general de errores
  private handleError(error: any) {
    console.error('❌ Error en UsuarioService:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }

  // 👤 Obtener información del usuario actual (protegido)
  getCurrentUser(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`).pipe(
      catchError(this.handleError)
    );
  }

  // 👥 Obtener todos los usuarios (protegido - admin)
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  // 👤 Obtener usuario por ID (protegido)
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ✏️ Actualizar usuario (protegido)
  updateUsuario(id: number, userData: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // 🗑️ Eliminar usuario (protegido)
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // 🔄 Actualizar perfil del usuario actual
  updateProfile(userData: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/profile`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // 🔐 Cambiar contraseña
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const body = { currentPassword, newPassword };
    return this.http.put(`${this.apiUrl}/change-password`, body).pipe(
      catchError(this.handleError)
    );
  }

  // 📧 Verificar si email existe
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`).pipe(
      catchError(this.handleError)
    );
  }

  // 🆔 Obtener ID del usuario actual desde el token
  getCurrentUserId(): number | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  }

  // ℹ️ Obtener información básica del usuario desde el token
  getCurrentUserInfo(): { id: number | null, email: string | null, rol: string | null } {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { id: null, email: null, rol: null };
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.userId || payload.sub || null,
        email: payload.email || null,
        rol: payload.rol || null
      };
    } catch {
      return { id: null, email: null, rol: null };
    }
  }
}