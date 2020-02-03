const express = require("express");
const baseController = require("../controllers/baseController");

const router = express.Router();

router.param("id", (req, res, next, val) => {
  //debug id
  //console.log(`Id param = ${val}`);
  next();
});

router
  .route("/")
  .get(baseController.tableSelection, baseController.getAllItems)
  .post(baseController.tableSelection, baseController.createNewItem); // wait for req_body: req.body
router
  .route("/:id")
  .get(baseController.tableSelection, baseController.getItem) // wait for req.params.id
  .patch(baseController.tableSelection, baseController.updateItem) // wait for req.params.id, req_body: req.body
  .delete(baseController.tableSelection, baseController.deleteItem); // wait for req.params.id

module.exports = router;
