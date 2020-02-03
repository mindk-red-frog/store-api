const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const Table = require("../models/tables");
const url = require("url");

function trimSlashes(string) {
  return string.replace(/^\/|\/$/g, "");
}

const controllersArray = ["products", "categories", "orders"];

//catchAsync is for catching async errors instead of try/catch wrapper + DRY principle
//usage - if (!currentSomething=await....)  return next(new AppError('No data found with this ID', 404));
exports.getAllItems = catchAsync(async (req, res, next) => {
  //to API class
  //console.log( req.query.controllerPath);
  res.status(200).send(await new Table(req.query.controllerPath).getAllList());
  //console.log(trimSlashes(req.controllerPath));
});

exports.tableSelection = catchAsync(async (req, res, next) => {
  //req.controllerPath  trimSlashes(req.controllerPath)
  /*const path = trimSlashes(
    url.format({
      pathname: req.originalUrl
    })
  );*/

  const path = url.format({
    pathname: req.originalUrl
  });

  //console.log("controller:" + path);
  controller = path.split("/")[1];

  console.log("controller:" + controller);

  if (controllersArray.includes(controller)) {
    req.query.controllerPath = controller;
    console.log("console.log(controller);" + req.query.controllerPath);
  }
  next();
});

exports.createNewItem = catchAsync(async (req, res, next) => {
  const createdTour = await new Table(req.query.controllerPath).insert(
    req.body
  );
  if (createdTour.rowCount > 0) {
    res.status(200).json({
      status: "success",
      data: req.body
    });
  } else return next(new AppError("Error during insert request", 404));
});

exports.getItem = catchAsync(async (req, res, next) => {
  const getedItem = await new Table(req.query.controllerPath).find(
    req.params.id
  );
  //console.log(typeof getedItem);
  if (getedItem.length !== 0) {
    res.status(200).json({
      status: "success",
      data: getedItem
    });
  } else return next(new AppError("No data found with this ID", 404));
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const updated = await new Table(req.query.controllerPath).update(
    req.params.id,
    req.body
  );
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
    return next(new AppError("Your request wasn't successfull", 404));
  }
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const deleted = await new Table(req.query.controllerPath).delete(
    req.params.id
  );
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
