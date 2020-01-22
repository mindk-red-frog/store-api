const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

//catchAsync is for catching async errors instead of try/catch wrapper + DRY principle
//usage - if (!currentSomething=await....)  return next(new AppError('No data found with this ID', 404));
exports.getAllCategories = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      status: 'success',
      message: 'getAllCategories fn'
    }
  });
});

exports.addNewCategory = catchAsync(async (req, res, next) => {
  res.status(201).json({
    data: {
      req_body: req.body,
      status: 'success',
      message: 'addNewCategory fn'
    }
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      status: 'success',
      message: 'getCategory fn'
    }
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  res.status(200).json({
    data: {
      id: req.params.id,
      req_body: req.body,
      status: 'success',
      message: 'updateCategory fn'
    }
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  res.status(204).json({
    data: {
      id: req.params.id,
      status: 'success',
      message: 'deleteCategory fn'
    }
  });
});
