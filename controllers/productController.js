const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const baseController = require("./baseController");
const Product = require("../models/product.model");
const Pure = require("../models/pure.model");
const helper = require("./../utils/helper");

class ProductController extends baseController {
  isQuestionMarkNeeded() {
    regExp = /\?/g;
    if (regExp.test(req.originalUrl)) {
      return "";
    } else {
      return "?";
    }
  }
  static getAllProducts = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).getAllProducts();
    let data, count, limit, offset, allPages, currentPage, headerStatus;
    //custom response with some important data
    if (typeof dbResponse[0] !== "undefined" && dbResponse[0].full_count) {
      headerStatus = 200;
      count = dbResponse[0].full_count;
      limit = dbResponse[0].limit;
      offset = dbResponse[0].offset;
      currentPage = Math.ceil(offset / limit) + 1;
      allPages = Math.ceil(count / limit);

      dbResponse.forEach(el => {
        el.full_count = undefined;
        el.limit = undefined;
        el.offset = undefined;
      });
      data = dbResponse;
    } else {
      headerStatus = 204;
    }

    res.status(headerStatus).json({
      status: typeof dbResponse !== "undefined" ? "succes" : "fail",
      count,
      allPages,
      currentPage,
      data
    });
  });

  //insertNewProduct
  static insertNewProduct = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).insertNewProduct();

    helper.sendResponse(dbResponse, res);
  });

  //////////////

  static getOneProduct = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).getOneProduct();

    console.log(dbResponse);

    helper.sendResponse(dbResponse, res);
  });

  ///////////////////////////
  static deleteProduct = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).deleteProduct();
    helper.sendResponse(dbResponse, res, 204);
  });

  ///////////////////////////
  static updateProduct = catchAsync(async (req, res, next) => {
    const dbResponse = await new Pure(req).updateProduct();

    helper.sendResponse(dbResponse, res);
  });

  //// class ending
}

module.exports = ProductController;
