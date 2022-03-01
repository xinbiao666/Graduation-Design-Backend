const express = require('express');
const path = require('path');
const resextra = require('./common/resextra');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const goods = require('./routes/goods');
const userLogin = require('./routes/user-login');
const shoppingCart = require('./routes/shoppingCart');
const order = require('./routes/order')
const location = require('./routes/nearby-location')
const wallet = require('./routes/wallet')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'source')));

app.all('*', function (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'X-Requested-With');
  response.header(
    'Access-Control-Allow-Methods',
    'PUT,POST,GET,DELETE,OPTIONS'
  );
  response.header('X-Powered-By', ' 3.2.1');
  response.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use(resextra);
app.use('/login', userLogin);
app.use('/goods', goods);
app.use('/shoppingCart', shoppingCart);
app.use('/order', order);
app.use('/location',location)
app.use('/wallet',wallet)

app.listen(port, () => {
  console.log('service on');
});
