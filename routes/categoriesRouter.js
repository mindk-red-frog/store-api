const categoriesRouter  = require('express').Router();
const categoriesController = require('../controllers/categoriesController')
const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController(categoriesRouter, categoriesController);


module.exports = categoriesRouter;
