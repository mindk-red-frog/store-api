const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  //debug id
  //console.log(`Id param = ${val}`);
  next();
});

router
  .route('/')
  .get(productController.getAllProducts)
  .post(productController.createNewProduct); // wait for req_body: req.body
router
  .route('/:id')
  .get(productController.getProduct) // wait for req.params.id
  .patch(productController.updateProduct) // wait for req.params.id, req_body: req.body
  .delete(productController.deleteProduct); // wait for req.params.id

module.exports = router;
