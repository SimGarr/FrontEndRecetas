import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private storage = inject(Storage);

  constructor() {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    console.log('✅ Storage inicializado');
  }
}
