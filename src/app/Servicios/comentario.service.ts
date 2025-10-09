import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private apiUrl = 'http://localhost:8080/comentarios';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  /**
   * Crear nuevo comentario
   */
  addComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(this.apiUrl, comentario, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener todos los comentarios de una receta
   */
  getComentariosByReceta(recetaId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/receta/${recetaId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener comentarios de un usuario
   */
  getComentariosByUsuario(usuarioId: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Eliminar comentario
   */
  deleteComentario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}