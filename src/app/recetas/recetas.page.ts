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

  userName: string = localStorage.getItem('userName') || 'Invitado';

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
    // Leer nombre desde localStorage al iniciar la página
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      this.userName = storedName;
    }
  }

  // Métodos simulados de navegación
  goToProfile() { console.log('Ir a perfil'); }
  goToSettings() { console.log('Ir a ajustes'); }
  goToFollowers() { console.log('Ir a seguidores'); }
  goToStats() { console.log('Ir a estadísticas'); }
  goToFAQ() { console.log('Ir a preguntas frecuentes'); }
  sendFeedback() { console.log('Enviar opinión'); }
  goToVisitedRecipes() { console.log('Ir a recetas visitadas'); }

  logout() {
    console.log('Cerrando sesión');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName'); // Limpiar el nombre también
    this.router.navigateByUrl('/login');
  }
}
