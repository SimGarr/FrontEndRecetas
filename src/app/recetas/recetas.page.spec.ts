import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton,
  IonButtons, IonMenu, IonList, IonItem, IonIcon 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  personOutline, settingsOutline, peopleOutline, statsChartOutline, 
  helpCircleOutline, chatboxEllipsesOutline, bookOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons,
    IonMenu, IonList, IonItem, IonIcon,
    CommonModule, FormsModule
  ]
})
export class RecetasPage implements OnInit {

  recetas = [
    { nombre: 'Spaghetti Carbonara' },
    { nombre: 'Pollo al Curry' },
    { nombre: 'Ensalada César' },
    { nombre: 'Sopa de Tomate' }
  ];

  constructor(private router: Router) {
    addIcons({
      personOutline, settingsOutline, peopleOutline, statsChartOutline, 
      helpCircleOutline, chatboxEllipsesOutline, bookOutline
    });
  }

  ngOnInit() {}

  goToProfile() { console.log('Ir a Perfil'); }
  goToSettings() { console.log('Ir a Ajustes'); }
  goToFollowers() { console.log('Ir a Seguidores'); }
  goToStats() { console.log('Ir a Estadísticas'); }
  goToFAQ() { console.log('Ir a Preguntas frecuentes'); }
  sendFeedback() { console.log('Enviar Opinión'); }
  goToVisitedRecipes() { console.log('Ir a Recetas visitadas'); }
}
