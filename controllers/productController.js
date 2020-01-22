const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

//catchAsync is for catching async errors instead of try/catch wrapper + DRY principle
//usage - if (!currentSomething=await....)  return next(new AppError('No data found with this ID', 404));
exports.getAllProducts = catchAsync(async (req, res, next) => {
  //to API class

  res.status(200).json({
    data: {
      status: 'success',
      message: 'getAllProducts fn'
    }
  });
});

exports.createNewProduct = catchAsync(async (req, res, next) => {
  res.status(201).json({
    data: {
      req_body: req.body,
      status: 'success',
      message: 'createNewProduct fn'
    }
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      status: 'success',
      message: 'getProduct fn'
    }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      req_body: req.body,
      status: 'success',
      message: 'updateProduct fn'
    }
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  res.status(204).json({
    //204 - no content
    data: {
      id: req.params.id,
      status: 'success',
      message: 'deleteProduct fn'
    }
  });
});
