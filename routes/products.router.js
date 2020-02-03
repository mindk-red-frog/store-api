const productsRouter = require ('express').Router();
const productsController = require('../controllers/products.controller');

const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController(productsRouter, productsController);

module.exports = productsRouter;