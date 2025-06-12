const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const products = [
  {
    name: 'Apples',
    price: 1.99,
    image: 'https://via.placeholder.com/150?text=Apples'
  },
  {
    name: 'Bananas',
    price: 0.99,
    image: 'https://via.placeholder.com/150?text=Bananas'
  },
  {
    name: 'Carrots',
    price: 2.49,
    image: 'https://via.placeholder.com/150?text=Carrots'
  },
  {
    name: 'Bread',
    price: 2.99,
    image: 'https://via.placeholder.com/150?text=Bread'
  },
  {
    name: 'Milk',
    price: 3.49,
    image: 'https://via.placeholder.com/150?text=Milk'
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
