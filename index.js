require('dotenv').config();
const express = require('express');
const app = express();
const usersRouter = require('./routes/users.router');
const productsRouter = require('./routes/products.router');
const ordersRouter = require('./routes/orders.router');
const categoriesRouter = require('./routes/categories.router');
const rolesRouter = require('./routes/roles.router');
const serviceLocator = require('./services/service.locator');
const bodyParser = require('body-parser');
const urlendcodedParser = bodyParser.urlencoded({extended: false});

app.use(urlendcodedParser);

serviceLocator.register('db', require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
}));


app.use('/orders', ordersRouter);
app.use("/users", usersRouter);
app.use('/products',productsRouter);
app.use('/categories', categoriesRouter);
app.use('/roles', rolesRouter);



app.listen(process.env.APP_PORT, () => console.log(`API listening on port ${process.env.APP_PORT}!`));
