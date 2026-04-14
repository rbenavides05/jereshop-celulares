const express = require('express');
const multer = require('multer');
const path = require('path');

console.log('✅ upload.js cargado');

const router = express.Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta upload funcionando' });
});

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `product-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió ninguna imagen' });
  }

  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  res.status(201).json({
    message: 'Imagen subida correctamente',
    image_url: imageUrl
  });
});

module.exports = router;