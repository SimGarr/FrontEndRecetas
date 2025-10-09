import { Routes } from '@angular/router';
import { authGuard } from './Servicios/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'recetas',
    loadComponent: () => import('./recetas/recetas.page').then(m => m.RecetasPage),
    canActivate: [authGuard]  // 🔒 Protegido
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./recuperar-contrasena/recuperar-contrasena.page').then(m => m.RecuperarContrasenaPage)
  }
];
