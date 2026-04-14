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
  
  // Debe empezar con https://wa.me/
  if (!trimmed.startsWith('https://wa.me/')) {
    return false;
  }
  
  // Longitud máxima razonable
  if (trimmed.length > 500) {
    return false;
  }
  
  return true;
}

/**
 * Genera un enlace de WhatsApp con el número y mensaje predefinido
 * @param {string} phoneNumber - Número de teléfono (ej: "50312345678")
 * @param {string} productName - Nombre del producto para el mensaje
 * @returns {string} Enlace de WhatsApp completo
 * 
 * @example
 * generateWhatsAppLink("50312345678", "iPhone 15 Pro")
 * // Retorna: "https://wa.me/50312345678?text=Hola%2C%20me%20interesa%20el%20iPhone%2015%20Pro"
 */
function generateWhatsAppLink(phoneNumber, productName) {
  const message = `Hola, me interesa el ${productName}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Valida todos los campos de un producto
 * @param {Object} product - Datos del producto
 * @param {boolean} isUpdate - Si es una actualización (campos opcionales)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateProduct(product, isUpdate = false) {
  const errors = [];
  
  // En actualizaciones, los campos son opcionales
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
  generateWhatsAppLink,
  validateProduct
};
