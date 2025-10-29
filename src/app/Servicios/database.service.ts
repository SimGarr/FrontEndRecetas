import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbInstance: SQLiteObject | null = null;

  constructor(private sqlite: SQLite) {}

  // 🧱 Inicializar o abrir la base de datos
  async initDB() {
    try {
      console.log('🚀 Iniciando conexión con SQLite (Cordova)...');

      this.dbInstance = await this.sqlite.create({
        name: 'recetasApp.db',
        location: 'default'
      });

      console.log('✅ Base de datos abierta correctamente.');

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS sesiones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT,
          token TEXT,
          fecha TEXT
        )
      `;
      await this.dbInstance.executeSql(createTableQuery, []);
      console.log('✅ Tabla "sesiones" creada o verificada.');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
    }
  }

  // 💾 Guardar sesión
  async guardarSesion(email: string, token: string) {
    try {
      if (!this.dbInstance) return;
      const fecha = new Date().toISOString();
      const query = `INSERT INTO sesiones (email, token, fecha) VALUES (?, ?, ?)`;
      await this.dbInstance.executeSql(query, [email, token, fecha]);
      console.log('💾 Sesión guardada en SQLite:', email);
    } catch (error) {
      console.error('❌ Error al guardar sesión:', error);
    }
  }

  // 📋 Obtener sesiones
  async obtenerSesiones(): Promise<any[]> {
    try {
      if (!this.dbInstance) return [];
      const res = await this.dbInstance.executeSql('SELECT * FROM sesiones ORDER BY fecha DESC', []);
      const sesiones: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        sesiones.push(res.rows.item(i));
      }
      console.log('📋 Sesiones actuales:', sesiones);
      return sesiones;
    } catch (error) {
      console.error('❌ Error al obtener sesiones:', error);
      return [];
    }
  }

  // 🗑️ Eliminar todas las sesiones
  async borrarSesiones() {
    try {
      if (!this.dbInstance) return;
      await this.dbInstance.executeSql('DELETE FROM sesiones', []);
      console.log('🗑️ Todas las sesiones eliminadas.');
    } catch (error) {
      console.error('❌ Error al eliminar sesiones:', error);
    }
  }
}
