const IS_LOCAL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const API_BASE = IS_LOCAL
  ? 'http://localhost:3000'
  : window.location.origin;

const API_URL = `${API_BASE}/api/products`;
const CLIENT_PHONE = '593983849782';

const productsContainer = document.getElementById('products-container');

function buildImageUrl(imagePath) {
  if (!imagePath) return '';

  if (imagePath.startsWith('http://localhost:3000')) {
    return imagePath.replace('http://localhost:3000', API_BASE);
  }

  if (imagePath.startsWith('http://127.0.0.1:3000')) {
    return imagePath.replace('http://127.0.0.1:3000', API_BASE);
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  return `${API_BASE}${imagePath}`;
}

function buildWhatsAppLink(productName) {
  const safeName = productName?.trim() || 'este producto';
  const message = `Hola, me interesa el ${safeName}`;
  return `https://wa.me/${CLIENT_PHONE}?text=${encodeURIComponent(message)}`;
}

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '';
  return Number(value).toFixed(2);
}

function getStatusBadge(status) {
  if (status === 'agotado') {
    return `
      <div class="product-stock-badge agotado">
        <span class="status-dot"></span>
        <span>AGOTADO</span>
      </div>
    `;
  }

  return `
    <div class="product-stock-badge disponible">
      <span class="status-dot"></span>
      <span>DISPONIBLE</span>
    </div>
  `;
}

function getOfferBadge() {
  return `
    <div class="product-offer-badge">
      OFERTA
    </div>
  `;
}

function getWhatsAppButton(product) {
  const status = product.status || 'disponible';

  if (status === 'agotado') {
    return `
      <button class="whatsapp-btn disabled-btn" type="button" disabled>
        Producto agotado
      </button>
    `;
  }

  const whatsappUrl = buildWhatsAppLink(product.name);

  return `
    <a
      class="whatsapp-btn"
      href="${whatsappUrl}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Consultar por WhatsApp
    </a>
  `;
}

function renderProducts(products) {
  if (!products || products.length === 0) {
    productsContainer.innerHTML = `
      <p class="empty-message">No hay productos disponibles por el momento.</p>
    `;
    return;
  }

  productsContainer.innerHTML = products.map(product => {
    const currentPrice = formatPrice(product.price);
    const originalPrice = product.original_price ? formatPrice(product.original_price) : null;
    const storage = product.storage || '';
    const imageUrl = buildImageUrl(product.image_url);
    const status = product.status || 'disponible';

      return `
  <article class="product-card ${status === 'agotado' ? 'product-card-out' : 'product-card-available'}">
    <div class="product-card-top">
      ${getStatusBadge(status)}
      ${getOfferBadge()}
    </div>

    <div class="product-image-wrapper">
      <img src="${imageUrl}" alt="${product.name}" loading="lazy">
    </div>

        <div class="product-info">
          ${storage ? `<p class="product-storage">${storage}</p>` : ''}
          <h3>${product.name}</h3>

          <div class="product-prices">
            ${originalPrice ? `<span class="old-price">$${originalPrice}</span>` : ''}
            <span class="product-price">$${currentPrice}</span>
          </div>

          ${getWhatsAppButton(product)}
        </div>
      </article>
    `;
  }).join('');
}

async function loadProducts() {
  try {
    productsContainer.innerHTML = '<p class="loading">Cargando productos...</p>';

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('No se pudieron cargar los productos');
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    productsContainer.innerHTML = `
      <p class="error-message">${error.message}</p>
    `;
    console.error('Error al cargar productos:', error);
  }
}

loadProducts();