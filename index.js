const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const products = [
  { name: 'Apples', price: 1.99, image: 'apple.jpg' },
  { name: 'Bananas', price: 0.99, image: 'banana.jpg' },
  { name: 'Carrots', price: 2.49, image: 'carrot.jpg' },
  { name: 'Bread', price: 2.99, image: 'bread.jpg' },
  { name: 'Milk', price: 3.49, image: 'milk.jpg' }
];

function getRandomProducts(count = 3) {
  const shuffled = products.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

app.get('/', (req, res) => {
  const randomProducts = getRandomProducts();
  res.render('index', { products: randomProducts });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
