import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonInput, 
  IonItem, 
  IonButton, 
  IonIcon, 
  IonToast 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput,
    IonItem,
    IonButton,
    IonIcon,
    IonToast
  ]
})
export class RecuperarContrasenaPage implements OnInit {

  correo: string = '';
  toastAbierto: boolean = false;
  mensajeToast: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  recuperarContrasena() {
    if (!this.correo.trim()) {
      this.mensajeToast = 'Por favor ingresa un correo válido';
      this.toastAbierto = true;
      return;
    }

  
    console.log('Correo para recuperación:', this.correo);

    this.mensajeToast = 'Si el correo existe, recibirás un enlace de recuperación.';
    this.toastAbierto = true;
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
