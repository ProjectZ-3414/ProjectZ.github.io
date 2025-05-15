const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const JWT_SECRET = 'supersecret'; // Change for production

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/projectz', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: Boolean
});

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

// Middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
function admin(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });
  next();
}

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password, adminCode } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const isAdmin = adminCode === 'admin123'; // Simple admin code
  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash, isAdmin });
  await user.save();
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid password' });
  const token = jwt.sign({ username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, isAdmin: user.isAdmin });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Admin routes
app.post('/api/products', auth, admin, async (req, res) => {
  const { name, description, price, image } = req.body;
  const product = new Product({ name, description, price, image });
  await product.save();
  res.json(product);
});

app.put('/api/products/:id', auth, admin, async (req, res) => {
  const { name, description, price, image } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, image }, { new: true });
  res.json(product);
});

app.delete('/api/products/:id', auth, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
