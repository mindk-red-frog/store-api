const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

//catchAsync is for catching async errors instead of try/catch wrapper + DRY principle
//usage - if (!currentSomething=await....)  return next(new AppError('No data found with this ID', 404));
exports.getAllOrders = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      status: 'success',
      message: 'getAllOrders fn'
    }
  });
});

exports.addNewOrder = catchAsync(async (req, res, next) => {
  res.status(201).json({
    data: {
      req_body: req.body,
      status: 'success',
      message: 'addNewOrder fn'
    }
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      status: 'success',
      message: 'getOrder'
    }
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      req_body: req.body,
      status: 'success',
      message: 'updateOrder fn'
    }
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  res.status(204).json({
    data: {
      id: req.params.id,
      status: 'success',
      message: 'deleteOrder fn'
    }
  });
});
