const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const baseController = require("../controllers/baseController");
const router = express.Router();

//we specify tableName as a parameter for  parent's class functions -> it'll be read using closures in baseController
//and no need to specify tblName if we use child's_Class functions

//restictTo(1||2)
//userRoles (roles db.table):
//1 - user
//2 - admin

router.route("/signup").post(authController.signUp);
router.post("/login/", authController.login);
router.post(
  "/edit_personal_info/",
  authController.protect,
  userController.editPersonalInfo
);
router.post(
  "/change_personal_password/",
  authController.protect,
  authController.changePersonalPassword
);
router.post("/forgot_password/", authController.forgotPassword);
router.patch("/reset_password/:token", authController.resetPassword);

router
  .route("/")
  .get(
    authController.protect,
    authController.restictTo(2),
    userController.getAllUsers
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restictTo(2),
    baseController.updateItem("users")
  )
  .delete(
    authController.protect,
    authController.restictTo(2),
    baseController.deleteItem("users")
  );

module.exports = router;
