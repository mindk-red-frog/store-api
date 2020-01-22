const rolesRouter = require ('express').Router();
const rolesController = require('../controllers/rolesController');

const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController(rolesRouter, rolesController);

module.exports = rolesRouter;