const express = require('express');
const cors = require('cors');
const path = require('path');

const { initialize } = require('./db/connection');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = 3000;

// Inicializar base de datos
initialize();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Jereshop backend funcionando ✅');
});

// Rutas de productos
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware global de errores
app.use((error, req, res, next) => {
  console.error('❌ Error:', error.message);

  res.status(error.status || 500).json({
    error: error.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});