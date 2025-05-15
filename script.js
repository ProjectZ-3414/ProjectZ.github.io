// Example product data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality sound, noise cancelling.",
    price: 49.99,
    image: "https://via.placeholder.com/180?text=Headphones"
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Track your fitness and notifications.",
    price: 89.99,
    image: "https://via.placeholder.com/180?text=Smart+Watch"
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    description: "Portable and powerful sound.",
    price: 29.99,
    image: "https://via.placeholder.com/180?text=Speaker"
  },
  {
    id: 4,
    name: "VR Headset",
    description: "Immersive virtual reality experience.",
    price: 99.99,
    image: "https://via.placeholder.com/180?text=VR+Headset"
  }
];

let cart = [];

function renderProducts() {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="price">$${product.price.toFixed(2)}</div>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsEl.appendChild(card);
  });
}

function addToCart(productId) {
  const found = cart.find(item => item.id === productId);
  if (found) {
    found.qty += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  updateCartCount();
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function showCart() {
  document.getElementById('cart-section').style.display = 'block';
  renderCartItems();
}

function hideCart() {
  document.getElementById('cart-section').style.display = 'none';
}

function renderCartItems() {
  const cartItemsEl = document.getElementById('cart-items');
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)} <button onclick="removeFromCart(${item.id})" style="background:none;border:none;color:#ff9800;cursor:pointer;">&times;</button></span>
    `;
    cartItemsEl.appendChild(li);
  });
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  renderCartItems();
}

document.getElementById('cart-btn').addEventListener('click', (e) => {
  e.preventDefault();
  showCart();
});

document.getElementById('close-cart').addEventListener('click', hideCart);

// Initialize
renderProducts();
updateCartCount();
