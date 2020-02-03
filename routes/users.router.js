const usersRouter = require('express').Router();
const usersController = require('../controllers/users.controllers');
const AddCRUDController = require('../static/AddCRUDController');

AddCRUDController (usersRouter, usersController);

module.exports = usersRouter;