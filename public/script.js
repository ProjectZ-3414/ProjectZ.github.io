// Show/hide login/admin links
const token = localStorage.getItem('token');
const isAdmin = localStorage.getItem('isAdmin') === 'true';
document.getElementById('login-link').style.display = token ? 'none' : '';
document.getElementById('logout-link').style.display = token ? '' : 'none';
document.getElementById('admin-link').style.display = isAdmin ? '' : 'none';
if (token) document.getElementById('user-info').innerText = 'Logged in';

// Logout
document.getElementById('logout-link').onclick = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAdmin');
  window.location.reload();
};

// Fetch and render products
async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${p.image}" alt="">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price">$${p.price}</div>
      <button onclick="alert('You bought: ${p.name}')">Buy</button>
    `;
    container.appendChild(div);
  });
}
loadProducts();
