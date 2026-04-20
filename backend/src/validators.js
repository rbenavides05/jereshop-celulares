/**
 * Utilidades de validación para productos
 */

/**
 * Valida que el nombre sea válido
 * @param {string} name - Nombre del producto
 * @returns {boolean} true si es válido
 */
function isValidName(name) {
  if (typeof name !== 'string') {
    return false;
  }

  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 200;
}

/**
 * Valida que el precio sea válido
 * @param {number} price - Precio del producto
 * @returns {boolean} true si es válido
 */
function isValidPrice(price) {
  if (typeof price !== 'number') {
    return false;
  }

  return price > 0 && isFinite(price);
}

/**
 * Valida que la URL de imagen sea válida
 * @param {string} imageUrl - URL de la imagen
 * @returns {boolean} true si es válido
 */
function isValidImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string') {
    return false;
  }

  const trimmed = imageUrl.trim();
  return trimmed.length > 0 && trimmed.length <= 500;
}

/**
 * Valida que el enlace de WhatsApp tenga el formato correcto
 * @param {string} whatsappLink - Enlace de WhatsApp
 * @returns {boolean} true si es válido
 */
function isValidWhatsAppLink(whatsappLink) {
  if (typeof whatsappLink !== 'string') {
    return false;
  }

  const trimmed = whatsappLink.trim();

  if (!trimmed.startsWith('https://wa.me/')) {
    return false;
  }

  if (trimmed.length > 500) {
    return false;
  }

  return true;
}

/**
 * Valida el estado del producto
 * @param {string} status - Estado del producto
 * @returns {boolean} true si es válido
 */
function isValidStatus(status) {
  if (typeof status !== 'string') {
    return false;
  }

  const trimmed = status.trim().toLowerCase();
  return trimmed === 'disponible' || trimmed === 'agotado';
}

/**
 * Genera un enlace de WhatsApp con el número y mensaje predefinido
 * @param {string} phoneNumber - Número de teléfono
 * @param {string} productName - Nombre del producto
 * @returns {string} Enlace de WhatsApp completo
 */
function generateWhatsAppLink(phoneNumber, productName) {
  const message = `Hola, me interesa el ${productName}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Valida todos los campos de un producto
 * @param {Object} product - Datos del producto
 * @param {boolean} isUpdate - Si es una actualización
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateProduct(product, isUpdate = false) {
  const errors = [];

  if (!isUpdate || product.name !== undefined) {
    if (!isValidName(product.name)) {
      errors.push('El nombre es requerido y debe tener entre 1 y 200 caracteres');
    }
  }

  if (!isUpdate || product.price !== undefined) {
    if (!isValidPrice(product.price)) {
      errors.push('El precio debe ser un número positivo');
    }
  }

  if (!isUpdate || product.image_url !== undefined) {
    if (!isValidImageUrl(product.image_url)) {
      errors.push('La URL de imagen es requerida y debe tener máximo 500 caracteres');
    }
  }

  if (!isUpdate || product.whatsapp_link !== undefined) {
    if (!isValidWhatsAppLink(product.whatsapp_link)) {
      errors.push('El enlace de WhatsApp debe empezar con https://wa.me/');
    }
  }

  if (!isUpdate || product.status !== undefined) {
    if (!isValidStatus(product.status)) {
      errors.push('El estado del producto debe ser "disponible" o "agotado"');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  isValidName,
  isValidPrice,
  isValidImageUrl,
  isValidWhatsAppLink,
  isValidStatus,
  generateWhatsAppLink,
  validateProduct
};