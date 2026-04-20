const express = require('express');
const { ADMIN_SECRET } = require('../middleware/authMiddleware');

const router = express.Router();

const ADMIN_EMAIL = 'admin@jereshop.com';
const ADMIN_PASSWORD = 'Jereshop2026*';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Debes ingresar correo y contraseña'
    });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: 'Credenciales incorrectas'
    });
  }

  return res.json({
    message: 'Login correcto',
    user: {
      email: ADMIN_EMAIL,
      role: 'admin'
    },
    adminKey: ADMIN_SECRET
  });
});

module.exports = router;