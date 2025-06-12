const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'grocery-secret',
    resave: false,
    saveUninitialized: true
  })
);

const products = [
  {
    id: 0,
    name: 'Apples',
    description: 'Fresh and crispy apples perfect for snacking.',
    price: 1.99,
    image: 'https://via.placeholder.com/300?text=Apples'
  },
  {
    id: 1,
    name: 'Bananas',
    description: 'Sweet bananas full of potassium.',
    price: 0.99,
    image: 'https://via.placeholder.com/300?text=Bananas'
  },
  {
    id: 2,
    name: 'Carrots',
    description: 'Crunchy carrots great for salads.',
    price: 2.49,
    image: 'https://via.placeholder.com/300?text=Carrots'
  },
  {
    id: 3,
    name: 'Bread',
    description: 'Soft and fresh bread loaves.',
    price: 2.99,
    image: 'https://via.placeholder.com/300?text=Bread'
  },
  {
    id: 4,
    name: 'Milk',
    description: 'Creamy milk sourced from local farms.',
    price: 3.49,
    image: 'https://via.placeholder.com/300?text=Milk'
  }
];

function getRandomProducts(count = 3) {
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

app.get('/', (req, res) => {
  const randomProducts = getRandomProducts();
  res.render('index', { products: randomProducts });
});

app.get('/products', (req, res) => {
  res.render('products', { products });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.render('product', { product });
});

app.post('/add-to-cart/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).send('Product not found');
  }
  if (!req.session.cart) {
    req.session.cart = [];
  }
  const existing = req.session.cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    req.session.cart.push({ ...product, quantity: 1 });
  }
  res.redirect('/cart');
});

app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { cart });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
