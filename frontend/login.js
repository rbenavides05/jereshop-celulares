const IS_LOCAL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const API_BASE = IS_LOCAL
  ? 'http://localhost:3001'
  : window.location.origin;

const LOGIN_URL = `${API_BASE}/api/auth/login`;

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageBox = document.getElementById('login-message');

if (localStorage.getItem('jereshop_admin_auth') === 'true') {
  window.location.href = '/admin';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  messageBox.textContent = '';

  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      throw new Error('Debes ingresar correo y contraseña');
    }

    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'No se pudo iniciar sesión');
    }

    localStorage.setItem('jereshop_admin_auth', 'true');
    localStorage.setItem('jereshop_admin_email', result.user.email);
    localStorage.setItem('jereshop_admin_key', result.adminKey);

    window.location.href = '/admin';
  } catch (error) {
    messageBox.textContent = error.message || 'Ocurrió un error al iniciar sesión';
    console.error('Error de login:', error);
  }
});