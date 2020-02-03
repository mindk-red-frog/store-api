const express = require("express");

const app = express();
const morgan = require("morgan");

const itemRouter = require("./routes/itemRoutes");
/*const orderRouter = require("./routes/orderRoutes");
const categoryRouter = require("./routes/categoryRoutes");*/
const serviceLocator = require("./utils/service.locator");
//const slash = require("express-slash");

//console.log(process.env);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
//set slash middleware
//app.use(slash());

// Init services:
serviceLocator.register(
  "db",
  require("knex")({
    client: process.env.DB_DRIVER,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      database: process.env.DB_NAME
    }
  })
);

//static html alias test
app.use("/public", express.static(`${__dirname}/public/`));

//default
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "hi from the server side", app: "mindkProject" });
});

//routes Mounting
app.use("/products", itemRouter); //we use a tourRouter middleware for '/api/..' route
app.use("/orders", itemRouter);
app.use("/categories", itemRouter);

//wrong route handler
app.all("*", (req, res, next) => {
  res.status(404).json({
    data: {
      status: "fail",
      message: "not found"
    }
  });
});

module.exports = app;
