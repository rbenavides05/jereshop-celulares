if (localStorage.getItem('jereshop_admin_auth') !== 'true') {
  window.location.href = '/login';
}

const IS_LOCAL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const API_BASE = IS_LOCAL
  ? 'http://localhost:3000'
  : window.location.origin;

const API_URL = `${API_BASE}/api/products`;
const UPLOAD_URL = `${API_BASE}/api/upload`;
const CLIENT_PHONE = '593983849782';
const ADMIN_KEY = localStorage.getItem('jereshop_admin_key') || '';

const form = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const originalPriceInput = document.getElementById('original_price');
const storageSelectInput = document.getElementById('storage_select');
const storageNoteInput = document.getElementById('storage_note');
const statusInput = document.getElementById('status');
const imageFileInput = document.getElementById('image_file');
const imageUrlInput = document.getElementById('image_url');
const whatsappLinkInput = document.getElementById('whatsapp_link');
const cancelEditBtn = document.getElementById('cancel-edit');
const adminProducts = document.getElementById('admin-products');
const logoutBtn = document.getElementById('logout-btn');

function getAdminHeaders(extra = {}) {
  return {
    'x-admin-key': ADMIN_KEY,
    ...extra
  };
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    const confirmed = confirm('¿Deseas cerrar sesión?');
    if (!confirmed) return;

    localStorage.removeItem('jereshop_admin_auth');
    localStorage.removeItem('jereshop_admin_email');
    localStorage.removeItem('jereshop_admin_key');

    window.location.href = '/login';
  });
}

async function fetchProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  return response.json();
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: formData
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'No se pudo subir la imagen');
  }

  return result.image_url;
}

function buildWhatsAppLink(productName) {
  const message = `Hola, me interesa el ${productName}`;
  return `https://wa.me/${CLIENT_PHONE}?text=${encodeURIComponent(message)}`;
}

function buildStorageValue() {
  const storageValue = storageSelectInput.value;
  const storageNote = storageNoteInput.value.trim();

  if (!storageValue) return null;

  return storageNote ? `${storageValue} - ${storageNote}` : storageValue;
}

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

function getStatusBadge(status) {
  return status === 'agotado'
    ? '<span class="product-status-badge agotado">Agotado</span>'
    : '<span class="product-status-badge disponible">Disponible</span>';
}

function resetForm() {
  form.reset();
  productIdInput.value = '';
  imageUrlInput.value = '';
  storageSelectInput.value = '';
  storageNoteInput.value = '';
  statusInput.value = 'disponible';

  if (whatsappLinkInput) {
    whatsappLinkInput.value = '';
  }
}

async function renderProducts() {
  const products = await fetchProducts();

  if (products.length === 0) {
    adminProducts.innerHTML = `
      <p class="empty-message">No hay productos registrados.</p>
    `;
    return;
  }

  adminProducts.innerHTML = products.map(product => {
    const imageUrl = buildImageUrl(product.image_url);
    const status = product.status || 'disponible';

    return `
      <article class="product-card">
        <img src="${imageUrl}" alt="${product.name}">

        <div class="product-info">
          ${getStatusBadge(status)}
          ${product.storage ? `<p class="product-storage">${product.storage}</p>` : ''}
          <h3>${product.name}</h3>

          <div class="product-prices">
            ${product.original_price ? `<span class="old-price">$${Number(product.original_price).toFixed(2)}</span>` : ''}
            <span class="product-price">$${Number(product.price).toFixed(2)}</span>
          </div>

          <div class="admin-card-actions">
            <button class="edit-btn" onclick="editProduct(${product.id})">Editar</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    let imageUrl = imageUrlInput.value;

    if (imageFileInput.files.length > 0) {
      imageUrl = await uploadImage(imageFileInput.files[0]);
      imageUrlInput.value = imageUrl;
    }

    const productName = nameInput.value.trim();
    const productStatus = statusInput.value || 'disponible';

    if (!productName) {
      throw new Error('Debes ingresar el nombre del producto');
    }

    if (!priceInput.value) {
      throw new Error('Debes ingresar el precio actual');
    }

    if (!imageUrl) {
      throw new Error('Debes subir una imagen del producto');
    }

    const whatsappLink = buildWhatsAppLink(productName);
    const fullStorage = buildStorageValue();

    const payload = {
      name: productName,
      price: Number(priceInput.value),
      original_price: originalPriceInput.value ? Number(originalPriceInput.value) : null,
      storage: fullStorage,
      image_url: imageUrl,
      whatsapp_link: whatsappLink,
      status: productStatus
    };

    const id = productIdInput.value;
    let response;

    if (id) {
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: getAdminHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
      });
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'No se pudo guardar el producto');
    }

    alert('Producto guardado correctamente');
    resetForm();
    await renderProducts();
  } catch (error) {
    alert(error.message || 'Ocurrió un error al guardar');
    console.error('Error al guardar producto:', error);
  }
});

cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

window.editProduct = async function(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error('No se pudo cargar el producto para editar');
    }

    const product = await response.json();

    productIdInput.value = product.id;
    nameInput.value = product.name;
    priceInput.value = product.price;
    originalPriceInput.value = product.original_price || '';
    imageUrlInput.value = product.image_url;
    statusInput.value = product.status || 'disponible';

    if (whatsappLinkInput) {
      whatsappLinkInput.value = product.whatsapp_link || '';
    }

    if (product.storage) {
      const parts = product.storage.split(' - ');
      storageSelectInput.value = parts[0] || '';
      storageNoteInput.value = parts.slice(1).join(' - ') || '';
    } else {
      storageSelectInput.value = '';
      storageNoteInput.value = '';
    }
  } catch (error) {
    alert(error.message);
    console.error('Error al editar producto:', error);
  }
};

window.deleteProduct = async function(id) {
  try {
    const confirmed = confirm('¿Seguro que deseas eliminar este producto?');
    if (!confirmed) return;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'No se pudo eliminar el producto');
    }

    await renderProducts();
  } catch (error) {
    alert(error.message);
    console.error('Error al eliminar producto:', error);
  }
};

renderProducts();