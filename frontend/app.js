const API_URL = 'http://localhost:3000/api/products';
const productsContainer = document.getElementById('products-container');

async function loadProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('No se pudieron cargar los productos');
    }

    const products = await response.json();

    if (products.length === 0) {
      productsContainer.innerHTML = '<p class="empty-message">No hay productos disponibles por el momento.</p>';
      return;
    }

    productsContainer.innerHTML = products.map(product => {
      const currentPrice = Number(product.price).toFixed(2);

      // Estos dos valores luego los podremos sacar de la base de datos
      const originalPrice = product.original_price ? Number(product.original_price).toFixed(2) : null;
      const storage = product.storage || '';

      // WhatsApp automático según el producto que el cliente registró
      const clientPhoneNumber = '593983849782';
      const message = `Hola, me interesa el ${product.name}`;
      const whatsappUrl = `https://wa.me/${clientPhoneNumber}?text=${encodeURIComponent(message)}`;

      return `
        <article class="product-card">
          <div class="product-badge">OFERTA</div>

          <img src="${product.image_url}" alt="${product.name}">

          <div class="product-info">
           <p class="product-storage">${storage}</p>
           <h3>${product.name}</h3>

          <div class="product-prices">
            ${originalPrice ? `<span class="old-price">$${originalPrice}</span>` : ''}
            <span class="product-price">$${currentPrice}</span>
          </div>

            <a class="whatsapp-btn" href="${whatsappUrl}" target="_blank">
              Consultar por WhatsApp
            </a>
          </div>
        </article>
      `;
    }).join('');

  } catch (error) {
    productsContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    console.error('Error al cargar productos:', error);
  }
}

loadProducts();