import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  // Registro de usuario
  createUsuario(userData: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Login (retorna token)
  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password };
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  // Guardar token en localStorage
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  // Obtener token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
  }

  // Obtener todos los usuarios (protegido)
  getUsuarios(): Observable<Usuario[]> {
    const token = this.getToken();
    return this.http.get<Usuario[]>(`${this.apiUrl}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  // Obtener usuario por ID (protegido)
  getUsuarioById(id: number): Observable<Usuario> {
    const token = this.getToken();
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  // Actualizar usuario (protegido)
  updateUsuario(id: number, userData: Usuario): Observable<Usuario> {
    const token = this.getToken();
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, userData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' })
    });
  }

  // Eliminar usuario (protegido)
  deleteUsuario(id: number): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }
}
