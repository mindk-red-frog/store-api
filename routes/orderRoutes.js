const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

//we specify tableName as a parameter for  parent's class functions -> it'll be read using closures in baseController
//and no need to specify tblName if we use child's_Class functions

//restictTo(1||2)
//userRoles (roles db.table):
//1 - user
//2 - admin

router
  .route("/status/:id")
  .patch(
    authController.protect,
    authController.restictTo(2),
    orderController.updateOrder
  )
  .delete(
    authController.protect,
    authController.restictTo(2),
    orderController.deleteOrder
  );
//
router
  .route("/cart/:id/:quantity")
  .post(authController.protect, orderController.addToCart);

router
  .route("/cart/:id")
  .delete(authController.protect, orderController.deleteFromCart);
//
router.route("/:id").get(authController.protect, orderController.getOneOrder);

router
  .route("/")

  .get(authController.protect, orderController.getAllOrders)
  .post(authController.protect, orderController.checkout);

module.exports = router;
