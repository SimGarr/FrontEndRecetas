import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  private apiUrl = 'http://localhost:8080/api/recetas';

  constructor(private http: HttpClient) { }

  // Obtener token desde localStorage
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Headers comunes
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  // ==================== RECETAS PÚBLICAS ====================

  /**
   * Obtener todas las recetas (público)
   */
  getAllRecetas(): Observable<Receta[]> {
    return this.http.get<Receta[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener receta por ID (público)
   */
  getRecetaById(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener recetas por categoría (público)
   */
  getRecetasByCategoria(categoria: string): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/categoria/${categoria}`, {
      headers: this.getHeaders()
    });
  }

  // ==================== RECETAS PROTEGIDAS ====================

  /**
   * Crear nueva receta (protegido - requiere autenticación)
   */
  createReceta(receta: Receta): Observable<Receta> {
    return this.http.post<Receta>(this.apiUrl, receta, {
      headers: this.getHeaders()
    });
  }

  /**
   * Actualizar receta (protegido - requiere autenticación)
   */
  updateReceta(id: number, receta: Receta): Observable<Receta> {
    return this.http.put<Receta>(`${this.apiUrl}/${id}`, receta, {
      headers: this.getHeaders()
    });
  }

  /**
   * Eliminar receta (protegido - requiere autenticación)
   */
  deleteReceta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // ==================== BÚSQUEDA Y FILTROS ====================

  /**
   * Buscar recetas por término (si implementas búsqueda)
   */
  searchRecetas(termino: string): Observable<Receta[]> {
    const params = new HttpParams().set('search', termino);
    return this.http.get<Receta[]>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Obtener recetas populares (basado en likes)
   */
  getRecetasPopulares(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/populares`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Obtener recetas recientes
   */
  getRecetasRecientes(): Observable<Receta[]> {
    return this.http.get<Receta[]>(`${this.apiUrl}/recientes`, {
      headers: this.getHeaders()
    });
  }
}