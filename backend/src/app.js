const express = require('express');
const cors = require('cors');
const path = require('path');

const { initialize } = require('./db/connection');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Inicializar base de datos
initialize();

// Rutas absolutas
const frontendPath = path.join(__dirname, '../../frontend');
const uploadsPath = path.join(__dirname, '../uploads');

// Middlewares
app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use('/uploads', express.static(uploadsPath));
app.use(express.static(frontendPath));

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

// Ruta pública principal
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ruta login
app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});

// Ruta admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

// Middleware global de errores
app.use((error, req, res, next) => {
  console.error('❌ Error:', error.message);

  res.status(error.status || 500).json({
    error: error.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
  console.log('✅ Sitio público disponible en /');
  console.log('✅ Login admin disponible en /login');
  console.log('✅ Panel admin disponible en /admin');
});