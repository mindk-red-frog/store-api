const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const BaseModel = require("./base.model");

class Product extends BaseModel {
  constructor(req) {
    super("products");
    Object.assign(this, req);
  }
}

module.exports = Product;
