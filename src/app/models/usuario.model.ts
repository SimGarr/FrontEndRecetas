export interface Usuario {
  id?: number;
  email: string;
  password?: string;
  nombre: string;
  apellido?: string;
  rol?: string;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}