const express = require("express");
const ordersRouter = express.Router();
const ordersController = require("../controllers/ordersController");

ordersRouter.get("/", ordersController.index);
ordersRouter.post("/", ordersController.create);
ordersRouter.get("/:id", ordersController.read);
ordersRouter.get("/:id", ordersController.update);
ordersRouter.get("/:id", ordersController.delete);

module.exports = ordersRouter;
