export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    nombre: string;
    rol: string;
  };
}