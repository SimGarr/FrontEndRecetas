export interface Comentario {
  id?: number;
  texto: string;
  fecha?: string;
  usuario: {
    id: number;
    nombre: string;
    email?: string;
  };
  receta: {
    id: number;
    nombre?: string;
  };
}