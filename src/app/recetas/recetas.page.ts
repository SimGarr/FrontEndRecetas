import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
// Update the path below to the correct location of auth.service.ts
import { AuthService } from '../Servicios/auth.service';

import { 
  IonApp, 
  IonMenu, 
  IonHeader, 
  IonToolbar, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonAvatar, 
  IonIcon, 
  IonBadge,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonRouterOutlet,
  IonSearchbar,
  IonChip,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonThumbnail
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  statsChartOutline,
  peopleOutline,
  bookOutline,
  settingsOutline,
  helpCircleOutline, 
  chatboxEllipsesOutline, 
  logOutOutline,
  notificationsOutline,
  fastFoodOutline,
  fishOutline,
  iceCreamOutline,
  cafeOutline,
  flameOutline,
  nutritionOutline,
  heart,
  star, cloudUpload, images, folderOpen, trash, restaurant, warning, bookmark, time, documentText } from 'ionicons/icons';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonIcon,
    IonBadge,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonRouterOutlet,
    IonSearchbar,
    IonChip,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonThumbnail
  ]
})
export class RecetasPage implements OnInit {

  userName: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    addIcons({cloudUpload,images,folderOpen,trash,restaurant,warning,bookmark,time,documentText,personOutline,statsChartOutline,peopleOutline,bookOutline,settingsOutline,helpCircleOutline,chatboxEllipsesOutline,logOutOutline,notificationsOutline,fastFoodOutline,fishOutline,iceCreamOutline,cafeOutline,flameOutline,nutritionOutline,heart,star});
  }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
  }

  IrPerfil() { console.log('Ir a perfil'); }
  IrAjustes() { console.log('Ir a ajustes'); }
  IrSeguidores() { console.log('Ir a seguidores'); }
  IrEstadisticas() { console.log('Ir a estadísticas'); }
  IrPreguntasFrecuentes() { console.log('Ir a preguntas frecuentes'); }
  EnviarOpinion() { console.log('Enviar opinión'); }
  IrRecetasVisitadas() { console.log('Ir a recetas visitadas'); }

  // ✅ Logout con confirmación y limpieza total
  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que deseas cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, cerrar',
          handler: async () => {
            console.log('🚪 Cerrando sesión...');
            await this.authService.removeToken();

            // Limpia datos locales del usuario
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');

            console.log('✅ Sesión cerrada correctamente');
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }
}
