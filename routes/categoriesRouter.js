const express = require("express");
const categoriesRouter = express.Router();
const categoriesController = require("../controllers/categoriesController");

categoriesRouter.get("/", categoriesController.index);
categoriesRouter.post("/", categoriesController.create);
categoriesRouter.get("/:id", categoriesController.read);
categoriesRouter.get("/:id", categoriesController.update);
categoriesRouter.get("/:id", categoriesController.delete);

module.exports = categoriesRouter;
