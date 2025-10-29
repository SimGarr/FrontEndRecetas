import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Like } from '../models/like.model';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  private apiUrl = 'https://apprecetas.duckdns.org/like';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  /**
   * Dar like a una receta
   */
  addLike(like: Like): Observable<Like> {
    return this.http.post<Like>(this.apiUrl, like, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener likes de un usuario
   */
  getLikesByUsuario(usuarioId: number): Observable<Like[]> {
    return this.http.get<Like[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener likes de una receta
   */
  getLikesByReceta(recetaId: number): Observable<Like[]> {
    return this.http.get<Like[]>(`${this.apiUrl}/receta/${recetaId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Verificar si el usuario actual dio like a una receta
   */
  checkUserLike(usuarioId: number, recetaId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${usuarioId}/${recetaId}`, {
      headers: this.getHeaders()
    });
  }
}