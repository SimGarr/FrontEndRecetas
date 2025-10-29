import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonToast,
  IonItem,
  IonButton,
  IonInput,
  IonInputPasswordToggle,
  IonContent,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  lockClosedOutline, 
  restaurantOutline, 
  personAddOutline, 
  sunnyOutline, 
  bookOutline, 
  heartOutline, 
  peopleOutline,
  fingerPrintOutline 
} from 'ionicons/icons';
import { UsuarioService } from '../Servicios/usuario.service';
import { AuthService } from '../Servicios/auth.service';

interface AuthResponse { token: string }

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonItem,
    IonButton,
    IonInput,
    IonInputPasswordToggle,
    IonToast,
    IonContent,
    IonIcon,
    IonLabel
  ]
})
export class LoginPage implements OnInit {
  correo = '';
  contrasena = '';
  toastAbierto = false;
  mensajeToast = '';
  biometricoDisponible = false;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService,
  ) {
    addIcons({
      mailOutline,
      lockClosedOutline,
      restaurantOutline,
      personAddOutline,
      bookOutline,
      heartOutline,
      peopleOutline,
      sunnyOutline,
      fingerPrintOutline
    });
  }

  async ngOnInit() {
    await this.verificarBiometrico();
  }

  async verificarBiometrico() {
    try {
      this.biometricoDisponible = await this.authService.isBiometricAvailable();
      console.log('🔐 Biométrico disponible:', this.biometricoDisponible);
    } catch (error) {
      console.error('Error verificando biométrico:', error);
      this.biometricoDisponible = false;
    }
  }

  // ✅ Login tradicional
  async iniciarSesion() {
    if (!this.correo || !this.contrasena) {
      this.mostrarToast('Por favor, ingresa correo y contraseña');
      return;
    }

    this.usuarioService.login(this.correo, this.contrasena).subscribe({
      next: async (res: AuthResponse) => {
        const token = res.token;
        if (token) {
          // Guardar token y registrar huella para próximos inicios
          await this.authService.setToken(token, this.correo);
          await this.authService.saveBiometricCredentials(this.correo, token);

          this.mostrarToast('¡Bienvenido de vuelta! 👨‍🍳');
          setTimeout(() => this.router.navigateByUrl('/recetas', { replaceUrl: true }), 1000);
        }
      },
      error: (err: any) => this.manejarErrorLogin(err)
    });
  }

  // ✅ Login con huella digital
  async iniciarSesionBiometrico() {
    if (!this.biometricoDisponible) {
      this.mostrarToast('La autenticación biométrica no está disponible');
      return;
    }

    try {
      this.mostrarToast('🔐 Verificando identidad...');
      const credentials = await this.authService.authenticateWithBiometric();

      if (credentials) {
        await this.authService.setToken(credentials.token, credentials.email);
        const isLoggedIn = await this.authService.isLoggedIn();

        if (isLoggedIn) {
          this.mostrarToast('¡Huella digital verificada! 👨‍🍳');
          setTimeout(() => this.router.navigateByUrl('/recetas', { replaceUrl: true }), 1000);
        } else {
          this.mostrarToast('Error en la autenticación biométrica');
        }
      }
    } catch (error: any) {
      console.error('Error en autenticación biométrica:', error);

      if (error.message?.includes('canceled')) {
        this.mostrarToast('Autenticación cancelada');
      } else if (error.message?.includes('No hay credenciales guardadas')) {
        this.mostrarToast('Primero inicia sesión normalmente para registrar tu huella');
      } else if (error.message?.includes('not enrolled')) {
        this.mostrarToast('No hay huellas registradas en este dispositivo');
      } else {
        this.mostrarToast('Error biométrico: ' + error.message);
      }
    }
  }

  private manejarErrorLogin(error: any) {
    if (error.status === 401) this.mostrarToast('Contraseña incorrecta');
    else if (error.status === 404) this.mostrarToast('Usuario no encontrado');
    else if (error.status === 0) this.mostrarToast('No se puede conectar al servidor');
    else this.mostrarToast('Error: ' + (error.error?.message || error.message));
  }

  irARegistro() { this.router.navigate(['/registro']); }
  irARecuperarContrasena() { this.router.navigate(['/recuperar-contrasena']); }

  mostrarToast(mensaje: string) {
    this.mensajeToast = mensaje;
    this.toastAbierto = true;
    setTimeout(() => (this.toastAbierto = false), 4000);
  }
}
