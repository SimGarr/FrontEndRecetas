export interface Like {
  id?: number;
  usuario: { id: number };
  receta: { id: number };
  fecha?: string;
}