const express = require('express');
const app = express();
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/css',express.static(path.join(__dirname, '/../css/')));
app.use('/images',express.static(path.join(__dirname, '/../images/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../index.html'));
})

app.get('/index.html', (req, res) => {
  res.redirect('/');
})

app.get('/shrooms', (req, res) => {
  res.sendFile(path.join(__dirname + '/../products.html'));
})

app.get('/products.html', (req, res) => {
  res.redirect('/shrooms');
})

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname + '/../about.html'));
})

app.get('/about.html', (req, res) => {
  res.redirect('/about');
})

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname + '/../contact.html'));
})

app.get('/contact.html', (req, res) => {
  res.redirect('/contact');
})

app.get('/shopping-cart', (req, res) => {
  res.sendFile(path.join(__dirname + '/../shopping-cart.html'));
})

app.get('/shopping-cart.html', (req, res) => {
  res.redirect('/shopping-cart');
})

app.post('/create-checkout-session', async (req, res) => {
  console.log(req.body);

  line_items = parseLineItemsFromBody(req.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: line_items,
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.json({ id: session.id });
});

function parseLineItemsFromBody(body) {
  line_items = [];
  body.forEach(item => {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.unit_amount,
      },
      quantity: item.quantity,
    })
  });

  return line_items;
}

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}!`))
