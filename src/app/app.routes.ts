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
    canActivate: [authGuard]
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./recuperar-contrasena/recuperar-contrasena.page').then(m => m.RecuperarContrasenaPage)
  },
  {
    path: 'subir-recetas',
    loadComponent: () => import('./subir-recetas/subir-recetas.page').then( m => m.SubirRecetasPage),
    canActivate: [authGuard]

  }
];
