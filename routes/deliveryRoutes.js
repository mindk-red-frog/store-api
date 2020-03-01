const express = require("express");
const baseController = require("../controllers/baseController");
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
  .get(baseController.getItem("delivery"))
  .patch(
    authController.protect,
    authController.restictTo(2),
    baseController.updateItem("delivery")
  )
  .delete(
    authController.protect,
    authController.restictTo(2),
    baseController.deleteItem("delivery")
  );

router
  .route("/")

  .get(baseController.getAllItems("delivery"))
  .post(
    authController.protect,
    authController.restictTo(2),
    baseController.createNewItem("delivery")
  );
module.exports = router;
