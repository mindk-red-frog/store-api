const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Tables = require("../models/base.model");

class BaseController {
  //wrapper to get all items from table name specified in (routes) usin closures
  static getAllItems = tblname => {
    return catchAsync(async (req, res, next) => {
      res.status(200).send(await new Tables(tblname).getAllList());
    });
  };

  static createNewItem = tblname => {
    return catchAsync(async (req, res, next) => {
      const createdItem = await new Tables(tblname).insert(req.body);
      if (createdItem.rowCount > 0) {
        res.status(200).json({
          status: "success",
          data: req.body
        });
      } else return next(new AppError("Error during insert request", 404));
    });
  };

  static getItem = tblname => {
    return catchAsync(async (req, res, next) => {
      const getedItem = await new Tables(tblname).find(req.params.id);
      //console.log(typeof getedItem);
      if (getedItem.length !== 0) {
        res.status(200).json({
          status: "success",
          data: getedItem
        });
      } else return next(new AppError("No data found with this ID", 404));
    });
  };

  static updateItem = tblname => {
    return catchAsync(async (req, res, next) => {
      const updated = await new Tables(tblname).update(req.params.id, req.body);
      console.log(updated);
      if (updated != 0) {
        res.status(200).json({
          data: {
            id: req.params.id,
            req_body: req.body,
            status: "success"
          }
        });
      } else {
        return next(new AppError("Your request wasn't successfull", 400));
      }
    });
  };

  static deleteItem = tblname => {
    return catchAsync(async (req, res, next) => {
      const deleted = await new Tables(tblname).delete(req.params.id);
      if (deleted) {
        res.status(204).json({
          status: "success"
        });
      } else {
        res.status(404).json({
          status: "error"
        });
      }
    });
  };
}
module.exports = BaseController;
