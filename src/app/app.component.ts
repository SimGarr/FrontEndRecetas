import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { AuthService } from './Servicios/auth.service';
import { DatabaseService } from './Servicios/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private dbService: DatabaseService
  ) {
    this.initializeApp();
  }

  private async initializeApp() {
    await this.platform.ready();
    console.log('✅ Plataforma lista');

    try {
      // ==========================
      // 🧱 INICIALIZAR BASE SQLITE
      // ==========================
      console.log('🚀 Inicializando base de datos SQLite...');
      await this.dbService.initDB();

      // (Opcional) Comprobar si ya hay sesiones guardadas
      const sesiones = await this.dbService.obtenerSesiones();
      console.log('📋 Sesiones actuales en SQLite:', sesiones);

      // ==========================
      // 🔐 INICIALIZAR AUTHSERVICE
      // ==========================
      console.log('🚀 Inicializando AuthService...');
      await this.authService.init();
      console.log('✅ AuthService listo');

      // Verificar si hay sesión activa
      const isLoggedIn = await this.authService.isLoggedIn();
      if (isLoggedIn) {
        console.log('🔐 Sesión activa detectada, redirigiendo...');
        await this.authService.redirectAfterLogin();
      } else {
        console.log('👋 No hay sesión activa');
      }
    } catch (error) {
      console.error('❌ Error durante la inicialización:', error);
    }
  }
}
