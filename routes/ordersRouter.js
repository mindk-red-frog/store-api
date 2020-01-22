const ordersRouter  = require('express').Router();
const ordersController = require('../controllers/ordersController')
const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController(ordersRouter, ordersController);

module.exports = ordersRouter;
