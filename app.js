const express = require('express');

const app = express();
const morgan = require('morgan');

const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const categoryRouter = require('./routes/categoryRoutes');

//console.log(process.env);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

//static html alias test
app.use('/public', express.static(`${__dirname}/public/`));

//default
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'hi from the server side', app: 'mindkProject' });
});

//routes Mounting
app.use('/api/v1/products', productRouter); //we use a tourRouter middleware for '/api/..' route
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/categories', categoryRouter);

//wrong route handler
app.all('*', (req, res, next) => {
  res.status(404).json({
    data: {
      status: 'fail',
      message: 'not found'
    }
  });
});

module.exports = app;
