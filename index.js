const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const categories = require("./routes/categoriesRouter");
const products = require("./routes/productsRouter");
const orders = require("./routes/ordersRouter");
const roles = require("./routes/rolesRouter");
const users = require("./routes/usersRouter");
const home = require("./routes/homeRouter");

app.use("/categories", categories);
app.use("/products", products);
app.use("/orders", orders);
app.use("/roles", roles);
app.use("/users", users);
app.use("/", home);

app.listen(PORT, () => console.log(`API listening on port ${PORT}!`));
