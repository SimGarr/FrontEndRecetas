export interface Usuario {
  id?: number;          // opcional, lo genera el backend
  nombre: string;
  email: string;
  password: string;
  rol?: string;         // opcional, si manejas roles
  fechaRegistro?: string; 
}
