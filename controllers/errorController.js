const AppError = require("./../utils/appError.js");

const handleForeignKeyViolation = err => {
  const message = `Please check your data in cat_id and manufacturer fields`; //${err.detail}
  return new AppError(message, 400);
};
const handleDuplicateFields = err => {
  const message = `You can't use the same data twice`; //${err.detail}
  return new AppError(message, 400);
};
//sendErrorDev for dev mode [config.env] NODE_ENV
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
//sendErrorProd for dev mode [config.env] NODE_ENV - without error details
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,

      message: err.message
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "smth went wrong!"
    });
  }
};
module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    // console.log(err);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    //console.log(error);

    error.message = err.message;

    //if (error.code === "23503") error = handleForeignKeyViolation(error);
    if (error.code === "23505") error = handleDuplicateFields(error);
    sendErrorProd(error, res);
  }
  next();
};
