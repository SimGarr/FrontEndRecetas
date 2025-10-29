import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  AlertController, 
  LoadingController, 
  NavController,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, cloudUpload, trash, images, folderOpen, restaurant, warning, bookmark, time, documentText } from 'ionicons/icons';
import { RecetasService } from '../Servicios/recetas.service';

@Component({
  selector: 'app-subir-recetas',
  templateUrl: './subir-recetas.page.html',
  styleUrls: ['./subir-recetas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonNote,
    IonButton,
    IonIcon
  ]
})
export class SubirRecetasPage {
  formularioReceta: FormGroup;
  archivoSeleccionado: File | null = null;
  vistaPreviaUrl: string | null = null;
  esVideo: boolean = false;

  categorias: string[] = [
    'Desayuno',
    'Almuerzo',
    'Cena',
    'Postre',
    'Bebida',
    'Ensalada',
    'Sopa',
    'Principal',
    'Aperitivo',
    'Vegetariana',
    'Vegana',
    'Sin Gluten'
  ];

  constructor(
    private fb: FormBuilder,
    private recetasService: RecetasService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navController: NavController
  ) {
    this.formularioReceta = this.crearFormulario();
    addIcons({cloudUpload,images,folderOpen,trash,restaurant,warning,bookmark,time,documentText,camera});
    
    // Verificar autenticación al cargar la página
    this.verificarAutenticacion();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', Validators.required],
      tiempoPreparacion: ['', [Validators.required, Validators.min(1)]],
    });
  }

  // Verificar si el usuario está autenticado
  private verificarAutenticacion() {
    const token = localStorage.getItem('authToken');
    console.log('🔐 Token en localStorage:', token ? 'PRESENTE' : 'AUSENTE');
    
    if (!token) {
      this.mostrarAlertaError('No estás autenticado. Por favor, inicia sesión primero.');
      this.navController.navigateBack('/login');
    }
  }

  onArchivoSeleccionado(event: any) {
    const archivo: File = event.target.files[0];
    
    if (archivo) {
      console.log('📁 Archivo seleccionado:', {
        nombre: archivo.name,
        tipo: archivo.type,
        tamaño: archivo.size
      });

      // Validar tipo de archivo
      if (!this.recetasService.validarTipoArchivo(archivo)) {
        this.mostrarAlertaError('Tipo de archivo no permitido. Use imágenes JPEG/PNG o videos MP4/AVI.');
        return;
      }

      // Validar tamaño (máximo 50MB)
      if (!this.recetasService.validarTamañoArchivo(archivo)) {
        this.mostrarAlertaError('El archivo es demasiado grande. Máximo 50MB.');
        return;
      }

      this.archivoSeleccionado = archivo;
      this.esVideo = this.recetasService.obtenerTipoArchivo(archivo) === 'video';

      // Crear vista previa
      const lector = new FileReader();
      lector.onload = () => {
        this.vistaPreviaUrl = lector.result as string;
      };
      lector.readAsDataURL(archivo);
    }
  }

  eliminarArchivo() {
    this.archivoSeleccionado = null;
    this.vistaPreviaUrl = null;
    this.esVideo = false;
  }

  async onSubmit() {
    // Verificar autenticación antes de enviar
    const token = localStorage.getItem('authToken');
    if (!token) {
      await this.mostrarAlertaError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      this.navController.navigateBack('/login');
      return;
    }

    if (this.formularioReceta.valid && this.archivoSeleccionado) {
      const loading = await this.loadingController.create({
        message: 'Subiendo receta...',
        spinner: 'crescent'
      });
      await loading.present();

      try {
        const datosReceta = this.formularioReceta.value;
        
        console.log('🚀 Iniciando subida de receta:', {
          nombre: datosReceta.nombre,
          categoria: datosReceta.categoria,
          archivo: this.archivoSeleccionado?.name
        });

        const respuesta = await this.recetasService.subirRecetaConArchivo(
          datosReceta, 
          this.archivoSeleccionado
        ).toPromise();
        
        console.log('✅ Receta subida exitosamente:', respuesta);
        await loading.dismiss();
        
        await this.mostrarAlertaExito();
        this.navController.navigateBack('/recetas');
        
      } catch (error: any) {
        await loading.dismiss();
        console.error('❌ Error en subida:', error);
        
        let mensajeError = 'Error al subir la receta. Inténtalo de nuevo.';
        
        // Manejar diferentes tipos de errores
        if (error.status === 403) {
          mensajeError = 'Acceso denegado. Tu sesión puede haber expirado. Por favor, inicia sesión nuevamente.';
          this.navController.navigateBack('/login');
        } else if (error.status === 401) {
          mensajeError = 'No autorizado. Por favor, inicia sesión.';
          this.navController.navigateBack('/login');
        } else if (error.status === 413) {
          mensajeError = 'El archivo es demasiado grande. Máximo 50MB.';
        } else if (error.status === 415) {
          mensajeError = 'Tipo de archivo no soportado. Use imágenes JPEG/PNG o videos MP4.';
        } else if (error.error?.message) {
          mensajeError = error.error.message;
        } else if (error.message) {
          mensajeError = error.message;
        }
        
        await this.mostrarAlertaError(mensajeError);
      }
    } else {
      let mensaje = '';
      
      if (!this.archivoSeleccionado) {
        mensaje = 'Por favor, selecciona una imagen o video de la receta.';
      } else if (!this.formularioReceta.get('nombre')?.valid) {
        mensaje = 'El nombre de la receta es requerido (mínimo 3 caracteres).';
      } else if (!this.formularioReceta.get('categoria')?.valid) {
        mensaje = 'Por favor, selecciona una categoría.';
      } else if (!this.formularioReceta.get('tiempoPreparacion')?.valid) {
        mensaje = 'El tiempo de preparación es requerido.';
      } else if (!this.formularioReceta.get('descripcion')?.valid) {
        mensaje = 'La descripción es requerida (mínimo 10 caracteres).';
      } else {
        mensaje = 'Por favor, completa todos los campos requeridos correctamente.';
      }
      
      await this.mostrarAlertaError(mensaje);
    }
  }

  private async mostrarAlertaExito() {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      message: 'Receta subida correctamente',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navController.navigateBack('/recetas');
          }
        }
      ]
    });
    await alert.present();
  }

  private async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método para probar la conexión con el servidor
  async probarConexion() {
    console.log('🔍 Probando conexión con el servidor...');
    
    try {
      // Intenta hacer una petición simple para verificar la conexión
      const recetas = await this.recetasService.getAllRecetas().toPromise();
      console.log('✅ Conexión exitosa, recetas obtenidas:', recetas?.length);
      return true;
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }
  }
}