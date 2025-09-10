import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  star
} from 'ionicons/icons';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    addIcons({
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
      star
    });
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

  logout() {
    console.log('Cerrando sesión');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    this.router.navigateByUrl('/login');
  }
}
