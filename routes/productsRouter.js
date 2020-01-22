const productsRouter = require ('express').Router();
const productsController = require('../controllers/productsController');

const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController(productsRouter, productsController);

module.exports = productsRouter;