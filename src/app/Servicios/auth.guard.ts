import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ authGuard ejecutándose para:', state.url);

  try {
    const isLoggedIn = await authService.isLoggedIn();
    console.log('🔍 Estado de autenticación:', isLoggedIn);

    if (isLoggedIn) {
      console.log('✅ Acceso permitido a', state.url);
      return true;
    }

    console.warn('🚫 Usuario no autenticado, redirigiendo a login...');
    await router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;

  } catch (error) {
    console.error('❌ Error en authGuard:', error);
    await router.navigate(['/login']);
    return false;
  }
};
