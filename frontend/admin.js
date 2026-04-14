const API_URL = 'http://localhost:3000/api/products';
const UPLOAD_URL = 'http://localhost:3000/api/upload';
const CLIENT_PHONE = '593983849782';

const form = document.getElementById('product-form');
const productIdInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const originalPriceInput = document.getElementById('original_price');
const storageSelectInput = document.getElementById('storage_select');
const storageNoteInput = document.getElementById('storage_note');
const imageFileInput = document.getElementById('image_file');
const imageUrlInput = document.getElementById('image_url');
const whatsappLinkInput = document.getElementById('whatsapp_link');
const cancelEditBtn = document.getElementById('cancel-edit');
const adminProducts = document.getElementById('admin-products');

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

function resetForm() {
  form.reset();
  productIdInput.value = '';
  imageUrlInput.value = '';
  storageSelectInput.value = '';
  storageNoteInput.value = '';
}

async function renderProducts() {
  const products = await fetchProducts();

  if (products.length === 0) {
    adminProducts.innerHTML = '<p class="empty-message">No hay productos registrados.</p>';
    return;
  }

  adminProducts.innerHTML = products.map(product => `
    <article class="product-card">
      <img src="${product.image_url}" alt="${product.name}">
      <div class="product-info">
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
  `).join('');
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
    const whatsappLink = buildWhatsAppLink(productName);
    const fullStorage = buildStorageValue();

    const payload = {
      name: productName,
      price: Number(priceInput.value),
      original_price: originalPriceInput.value ? Number(originalPriceInput.value) : null,
      storage: fullStorage,
      image_url: imageUrl,
      whatsapp_link: whatsappLink
    };

    const id = productIdInput.value;
    let response;

    if (id) {
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    alert(error.message);
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
    whatsappLinkInput.value = product.whatsapp_link || '';

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
      method: 'DELETE'
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