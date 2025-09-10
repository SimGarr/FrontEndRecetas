import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  // Registro de usuario
createUsuario(userData: Usuario): Observable<Usuario> {
  return this.http.post<Usuario>(`${this.apiUrl}/register`, userData);
}

  // Login
login(email: string, password: string): Observable<Usuario> {
  return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password });
}

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  // Obtener usuario por ID
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // Actualizar usuario
  updateUsuario(id: number, userData: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, userData);
  }

  // Eliminar usuario
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
