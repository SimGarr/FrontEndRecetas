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
  IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  restaurantOutline,
  personAddOutline,
  bookOutline,
  heartOutline,
  peopleOutline
} from 'ionicons/icons';
import { UsuarioService } from '../Servicios/usuario.service';
import { AuthResponse } from '../models/auth-response.model';

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
    IonIcon
  ]
})
export class LoginPage implements OnInit {
  correo: string = '';
  contrasena: string = '';
  toastAbierto: boolean = false;

  constructor(private router: Router, private usuarioService: UsuarioService) {
    addIcons({
      mailOutline,
      lockClosedOutline,
      restaurantOutline,
      personAddOutline,
      bookOutline,
      heartOutline,
      peopleOutline
    });
  }

  ngOnInit() {
    this.correo = '';
    this.contrasena = '';
  }

iniciarSesion() {
    if (!this.correo || !this.contrasena) {
        this.toastAbierto = true;
        return;
    }

    this.usuarioService.login(this.correo, this.contrasena).subscribe({
        next: (res: any) => {
            if (res.token) {
                this.usuarioService.saveToken(res.token);
                localStorage.setItem('usuarioLogeado', 'true');
                localStorage.setItem('correoUsuario', this.correo);
                this.router.navigateByUrl('/recetas');
            } else {
                alert(res.message || 'Login fallido: token no recibido');
            }
        },
        error: (error: any) => {
            console.error('Error completo:', error);
            if (error.error && error.error.message) {
                alert('Login fallido: ' + error.error.message);
            } else if (error.status === 0) {
                alert('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
            } else if (error.status === 403) {
                alert('Acceso denegado: revisa tus credenciales o configuración de CORS.');
            } else {
                alert('Error inesperado: ' + error.statusText);
            }
        }
    });
}

  irARegistro() {
    this.router.navigate(['/registro']);
  }

  irARecuperarContrasena() {
    this.router.navigate(['/recuperar-contrasena']);
  }
}
