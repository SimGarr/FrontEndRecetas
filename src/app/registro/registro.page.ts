import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonList, 
  IonIcon,
  AlertController,
  NavController 
} from '@ionic/angular/standalone';
import { UsuarioService } from '../Servicios/usuario.service'; // Importa tu servicio
import { Usuario } from '../models/usuario.model'; // Asegúrate de tener el model

// Validador personalizado para contraseñas
function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword) return null;
  return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonList, 
    IonIcon,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegistroPage implements OnInit {
  registerForm: FormGroup;
  registrationSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private navCtrl: NavController,
    private usuarioService: UsuarioService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() {}

  async onRegister() {
    if (this.registerForm.valid) {
      const nuevoUsuario: Usuario = {
        nombre: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        rol: 'USER'
      };

      this.usuarioService.createUsuario(nuevoUsuario).subscribe({
        next: async (res) => {
          this.registrationSuccess = true;
          const alert = await this.alertController.create({
            header: '¡Registro exitoso!',
            message: 'Bienvenido a nuestra comunidad de amantes de la cocina',
            buttons: ['OK']
          });
          await alert.present();
        },
        error: async (err) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'No se pudo registrar el usuario. Revisa que el email no exista.',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
      const alert = await this.alertController.create({
        header: 'Error de validación',
        message: 'Por favor, completa correctamente todos los campos',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  IrLogin() {
    this.navCtrl.navigateForward('/login');
  }

  IrRecetas() {
    this.navCtrl.navigateForward('/recetas');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
