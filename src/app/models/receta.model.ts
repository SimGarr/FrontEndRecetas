export interface Receta {
  id?: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagenUrl?: string;
  tiempoPreparacion: number;
  calificacionPromedio?: number;
  fechaCreacion?: string;
  // Campos adicionales para UI
  esFavorita?: boolean;
  tieneLike?: boolean;
  totalLikes?: number;
  totalComentarios?: number;
}

// Enums para categorías (opcional)
export enum CategoriaReceta {
  DESAYUNO = 'Desayuno',
  ALMUERZO = 'Almuerzo',
  CENA = 'Cena',
  POSTRE = 'Postre',
  ENSALADA = 'Ensalada',
  SOPA = 'Sopa',
  BEBIDA = 'Bebida',
  VEGETARIANA = 'Vegetariana',
  VEGANA = 'Vegana',
  SIN_GLUTEN = 'Sin Gluten'
}

// Interface para respuesta paginada (si implementas paginación)
export interface RecetasPaginadas {
  content: Receta[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}