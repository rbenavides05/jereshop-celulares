const ADMIN_SECRET = 'JereshopAdminSecure2026';

function verifyAdminAuth(req, res, next) {
  const adminKey = req.headers['x-admin-key'];

  if (!adminKey) {
    return res.status(401).json({
      error: 'Acceso no autorizado'
    });
  }

  if (adminKey !== ADMIN_SECRET) {
    return res.status(403).json({
      error: 'Clave de administrador inválida'
    });
  }

  next();
}

module.exports = {
  verifyAdminAuth,
  ADMIN_SECRET
};