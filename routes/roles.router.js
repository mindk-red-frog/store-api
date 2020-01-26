const rolesRouter = require ('express').Router();
const rolesController = require('../controllers/roles.controller');

const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController(rolesRouter, rolesController);

module.exports = rolesRouter;