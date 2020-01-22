const express = require('express');

const categoryController = require('./../controllers/categoryController');

const router = express.Router();

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.addNewCategory); // wait for req_body: req.body

router
  .route('/:id')
  .get(categoryController.getCategory) // wait for req.params.id
  .patch(categoryController.updateCategory) // wait for req.params.id, req_body: req.body
  .delete(categoryController.deleteCategory); // wait for req.params.id

module.exports = router;
