const categoriesRouter  = require('express').Router();
const categoriesController = require('../controllers/categories.controller')
const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController(categoriesRouter, categoriesController);


module.exports = categoriesRouter;
