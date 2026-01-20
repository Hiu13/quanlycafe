document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMessage');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.token);
          loginMsg.style.color = 'green';
          loginMsg.textContent = 'Đăng nhập thành công. Chuyển hướng...';
          setTimeout(() => location.href = '/dashboard', 600);
        } else {
          loginMsg.style.color = 'red';
          loginMsg.textContent = data.message || 'Đăng nhập thất bại';
        }
      } catch (err) {
        console.error(err);
        loginMsg.textContent = 'Lỗi mạng, thử lại sau';
      }
    });
  }

 // Register form
const registerForm = document.getElementById('registerForm');
const registerMsg = document.getElementById('message');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear lỗi cũ
    ['name', 'email', 'password'].forEach(field => {
      const errEl = document.getElementById(`${field}-error`);
      if (errEl) errEl.textContent = '';
    });
    registerMsg.textContent = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        registerMsg.style.color = 'green';
        registerMsg.textContent = 'Đăng ký thành công. Vui lòng đăng nhập.';
        registerForm.reset();
      } else {
        registerMsg.style.color = 'red';

        // Trường hợp lỗi validate từ backend
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach(err => {
            const el = document.getElementById(`${err.path}-error`);
            if (el) {
              el.textContent = err.msg;
            }
          });
        } else {
          registerMsg.textContent = data.message || 'Đăng ký thất bại';
        }
      }
    } catch (err) {
      console.error(err);
      registerMsg.style.color = 'red';
      registerMsg.textContent = 'Lỗi mạng, thử lại sau';
    }
  });
}
});
function logout() {
  localStorage.removeItem('token');
  location.href = '/';
}

window.logout = logout;
