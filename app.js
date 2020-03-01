const express = require("express");
const app = express();
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController.js");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const manufacturerRouter = require("./routes/manufacturerRoutes");
const deliveryRouter = require("./routes/deliveryRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const serviceLocator = require("./utils/service.locator");

//console.log(process.env);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

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

//default
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "hi from the server side", app: "mindkProject" });
});

//routes Mounting
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/manufacturers", manufacturerRouter);
app.use("/api/deliveries", deliveryRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

//wrong route handler
app.all("*", (req, res, next) => {
  res.status(404).json({
    data: {
      status: "fail",
      message: "route not found"
    }
  });
});

app.use(globalErrorHandler);

module.exports = app;
