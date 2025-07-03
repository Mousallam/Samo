const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)'
  );
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'grocery-secret',
    resave: false,
    saveUninitialized: true
  })
);

// expose user to views
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

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

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashed],
    err => {
      if (err) {
        return res.status(400).send('User already exists');
      }
      req.session.user = { username };
      res.redirect('/');
    }
  );
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err || !row) {
      return res.status(400).send('Invalid credentials');
    }
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      return res.status(400).send('Invalid credentials');
    }
    req.session.user = { id: row.id, username: row.username };
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.redirect('/cart');
  }
  res.render('checkout');
});

app.post('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const { cardNumber, expMonth, expYear, cvc } = req.body;
  const amount = (req.session.cart || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  stripe.charges
    .create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      source: {
        object: 'card',
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc
      },
      description: 'Grocery purchase'
    })
    .then(() => {
      req.session.cart = [];
      res.send('Payment successful');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Payment failed');
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
