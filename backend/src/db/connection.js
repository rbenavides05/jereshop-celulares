const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Ruta a la base de datos
const DB_PATH = path.join(__dirname, '../../database/jereshop.db');
// Ruta al schema SQL
const SCHEMA_PATH = path.join(__dirname, '../../database/schema.sql');

let db = null;

/**
 * Obtiene la instancia de la base de datos
 * @returns {Database} Instancia de la base de datos SQLite
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initialize() first.');
  }
  return db;
}

/**
 * Inicializa la conexión a la base de datos
 * Crea la base de datos si no existe y ejecuta el schema
 */
function initialize() {
  try {
    // Crear conexión a la base de datos
    db = new Database(DB_PATH);
    
    // Habilitar foreign keys (buena práctica)
    db.pragma('foreign_keys = ON');
    
    console.log('✅ Conexión a base de datos establecida');
    
    // Leer y ejecutar el schema SQL
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
    
    console.log('✅ Schema de base de datos aplicado');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error.message);
    throw error;
  }
}

/**
 * Cierra la conexión a la base de datos
 */
function close() {
  if (db) {
    db.close();
    db = null;
    console.log('✅ Conexión a base de datos cerrada');
  }
}

module.exports = {
  getDb,
  initialize,
  close
};
