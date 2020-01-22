const express = require('express');

const orderController = require('./../controllers/orderController');

const router = express.Router();

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.addNewOrder); // wait for req_body: req.body

router
  .route('/:id')
  .get(orderController.getOrder) // wait for req.params.id
  .patch(orderController.updateOrder) // wait for req.params.id, req_body: req.body
  .delete(orderController.deleteOrder); // wait for  req.params.id, req_body: req.body

module.exports = router;
