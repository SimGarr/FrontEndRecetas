import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorito } from '../models/favorito.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {

  private apiUrl = 'http://localhost:8080/favoritos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  /**
   * Obtener favoritos de un usuario
   */
  getFavoritosByUsuario(usuarioId: number): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Agregar receta a favoritos
   */
  agregarFavorito(favorito: Favorito): Observable<Favorito> {
    return this.http.post<Favorito>(this.apiUrl, favorito, {
      headers: this.getHeaders()
    });
  }

  /**
   * Eliminar receta de favoritos
   */
  eliminarFavorito(usuarioId: number, recetaId: number): Observable<void> {
    const params = `usuarioId=${usuarioId}&recetaId=${recetaId}`;
    return this.http.delete<void>(`${this.apiUrl}?${params}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Verificar si una receta está en favoritos
   */
  esFavorito(usuarioId: number, recetaId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${usuarioId}/${recetaId}`, {
      headers: this.getHeaders()
    });
  }
}