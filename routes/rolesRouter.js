const express = require("express");
const rolesRouter = express.Router();
const rolesController = require("../controllers/rolesController");

rolesRouter.get("/", rolesController.index);
rolesRouter.post("/", rolesController.create);
rolesRouter.get("/:id", rolesController.read);
rolesRouter.get("/:id", rolesController.update);
rolesRouter.get("/:id", rolesController.delete);

module.exports = rolesRouter;
