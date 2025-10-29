import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';

import { IonicStorageModule } from '@ionic/storage-angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { JwtInterceptor } from './app/Servicios/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // 👇 Reutilización de rutas Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // 👇 Configuración base de Ionic + Router
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // 👇 HTTP con interceptores declarados
    provideHttpClient(withInterceptorsFromDi()),

    // 👇 Soporte de animaciones Angular
    provideAnimations(),

    // 👇 Configuración global de Ionic Storage
    importProvidersFrom(IonicStorageModule.forRoot()),

    // 👇 Registro del plugin SQLite Cordova
    SQLite,

    // 👇 Interceptor JWT correctamente registrado
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
}).catch(err => console.error(err));
