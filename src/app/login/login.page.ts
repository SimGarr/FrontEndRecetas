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
import { Usuario } from '../models/usuario.model';

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
      next: (usuario: Usuario) => {
        // Login exitoso
        localStorage.setItem('usuarioLogeado', 'true');
        localStorage.setItem('correoUsuario', usuario.email);
        localStorage.setItem('nombreUsuario', usuario.nombre);
        this.router.navigateByUrl('/recetas');
      },
      error: (error: any) => {
        console.error('Error al iniciar sesión:', error);
        this.toastAbierto = true;
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
