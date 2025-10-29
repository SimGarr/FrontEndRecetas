import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.model';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  private apiUrl = 'https://apprecetas.duckdns.org/api/recetas';
  private subidaUrl = 'https://apprecetas.duckdns.org/api/subida/receta';
  private archivosUrl = 'https://apprecetas.duckdns.org/api/archivos';

  constructor(private http: HttpClient) { }

  // Obtener token desde localStorage
  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Headers comunes para JSON
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  // Headers para FormData (sin Content-Type)
  private getHeadersFormData(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      ...(token && { Authorization: `Bearer ${token}` })
    });
  }

  // ==================== SUBIDA DE ARCHIVOS ====================

  /**
   * Subir receta con archivo (imagen o video)
   */
  subirRecetaConArchivo(datosReceta: any, archivo: File): Observable<any> {
    const formData = new FormData();
    
    // Agregar archivo
    formData.append('archivo', archivo, archivo.name);
    
    // Agregar datos de la receta
    formData.append('nombre', datosReceta.nombre);
    formData.append('descripcion', datosReceta.descripcion);
    formData.append('categoria', datosReceta.categoria);
    formData.append('tiempoPreparacion', datosReceta.tiempoPreparacion.toString());

    return this.http.post(this.subidaUrl, formData, {
      headers: this.getHeadersFormData()
    });
  }

  /**
   * Obtener URL completa del archivo
   */
  obtenerUrlArchivo(nombreArchivo: string): string {
    return `${this.archivosUrl}/${nombreArchivo}`;
  }

  /**
   * Obtener URL de visualización para una receta
   */
  obtenerUrlVisualizacion(receta: Receta): string {
    if (receta.imagenUrl) {
      // Si es una URL local de nuestro servidor
      if (receta.imagenUrl.includes('/api/archivos/')) {
        const nombreArchivo = receta.imagenUrl.split('/').pop();
        return this.obtenerUrlArchivo(nombreArchivo || '');
      }
      // Si es una URL externa
      return receta.imagenUrl;
    }
    // Imagen por defecto
    return 'assets/images/receta-placeholder.jpg';
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

  // ==================== UTILIDADES ====================

  /**
   * Validar tipo de archivo
   */
  validarTipoArchivo(archivo: File): boolean {
    const tiposPermitidos = [
      'image/jpeg', 
      'image/png', 
      'image/jpg', 
      'video/mp4', 
      'video/avi',
      'video/quicktime'
    ];
    return tiposPermitidos.includes(archivo.type);
  }

  /**
   * Validar tamaño de archivo (máximo 50MB)
   */
  validarTamañoArchivo(archivo: File): boolean {
    const tamañoMaximo = 50 * 1024 * 1024; // 50MB en bytes
    return archivo.size <= tamañoMaximo;
  }

  /**
   * Obtener tipo de archivo (imagen o video)
   */
  obtenerTipoArchivo(archivo: File): string {
    return archivo.type.startsWith('video/') ? 'video' : 'imagen';
  }
}