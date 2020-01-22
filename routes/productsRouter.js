const express = require("express");
const productsRouter = express.Router();
const productsController = require("../controllers/productsController");

productsRouter.get("/", productsController.index);
productsRouter.post("/", productsController.create);
productsRouter.get("/:id", productsController.read);
productsRouter.get("/:id", productsController.update);
productsRouter.get("/:id", productsController.delete);

module.exports = productsRouter;
