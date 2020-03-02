const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

//we specify tableName as a parameter for  parent's class functions -> it'll be read using closures in baseController
//and no need to specify tblName if we use child's_Class functions

//restictTo(1||2)
//userRoles (roles db.table):
//1 - user
//2 - admin

router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(
    authController.protect,
    authController.restictTo(2),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restictTo(2),
    productController.deleteProduct
  );

router
  .route("/")

  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restictTo(2),
    productController.insertNewProduct
  );

module.exports = router;
