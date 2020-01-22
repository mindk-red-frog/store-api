const express = require('express');
const app = express();
const port = 3005;
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const ordersRouter = require('./routes/ordersRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const rolesRouter = require('./routes/rolesRouter');
const bodyParser = require('body-parser');
const urlendcodedParser = bodyParser.urlencoded({extended: false});

app.use(urlendcodedParser);


app.use('/orders', ordersRouter);
app.use("/users", usersRouter);
app.use('/products',productsRouter);
app.use('/categories', categoriesRouter);
app.use('/roles', rolesRouter);



app.listen(port, () => console.log(`API listening on port ${port}!`));
