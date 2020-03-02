const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const baseController = require("./baseController");
const Pure = require("../models/pure.model");
const helper = require("./../utils/helper");

class OrderController extends baseController {
  //addToCart
  static addToCart = catchAsync(async (req, res, next) => {
    const { id, quantity } = req.params;
    if (!id) {
      return next(new AppError("Blank product_id", 400));
    }
    if (quantity <= 0) {
      return next(new AppError("Quantity can't be less than 1", 400));
    }

    const dbResponse = await new Pure(req).addToCart();

    helper.sendResponse(dbResponse, res);
  });
  //
  //checkout
  static checkout = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).checkout();
    helper.sendResponse(dbResponse, res);
  });

  //deleteFromCart
  static deleteFromCart = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("Blank product_id", 400));
    }

    const dbResponse = await new Pure(req).deleteFromCart();
    helper.sendResponse(dbResponse, res, 204);
  });

  //getOneOrder
  static getOneOrder = catchAsync(async (req, res, next) => {
    // let status;
    const { id } = req.params;
    if (!id) {
      return next(new AppError("Blank order_id", 400));
    }
    const dbResponse = await new Pure(req).getOneOrder();
    helper.sendResponse(dbResponse, res);
  });

  //getAllOrders
  static getAllOrders = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).getAllOrders();
    helper.sendResponse(dbResponse, res);
  });

  //updateOrder //admin
  static updateOrder = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).updateOrder();
    helper.sendResponse(dbResponse, res);
  });

  //deleteOrder //admin
  static deleteOrder = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).deleteOrder();
    helper.sendResponse(dbResponse, res, 204);
  });

  ///
}

module.exports = OrderController;
