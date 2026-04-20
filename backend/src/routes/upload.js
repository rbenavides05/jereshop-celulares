const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyAdminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

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

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/', verifyAdminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No se recibió ninguna imagen'
    });
  }

  res.json({
    message: 'Imagen subida correctamente',
    image_url: `/uploads/${req.file.filename}`
  });
});

module.exports = router;