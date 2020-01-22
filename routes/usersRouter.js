const express = require("express");
const usersRouter = express.Router();
const usersController = require("../controllers/usersController");

usersRouter.get("/", usersController.index);
usersRouter.post("/", usersController.create);
usersRouter.get("/:id", usersController.read);
usersRouter.get("/:id", usersController.update);
usersRouter.get("/:id", usersController.delete);

module.exports = usersRouter;
