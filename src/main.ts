import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { JwtInterceptor } from './app/Servicios/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),

    provideRouter(routes, withPreloading(PreloadAllModules)),

    // HttpClient con interceptores desde DI
    provideHttpClient(withInterceptorsFromDi()),

    // Proveer Storage manualmente
    {
      provide: Storage,
      useFactory: async () => {
        const storage = new Storage();
        await storage.create();
        return storage;
      }
    },

    // Interceptor registrado para inyección DI
    JwtInterceptor,
  ],
});
