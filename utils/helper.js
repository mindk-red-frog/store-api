//JS Date to PostgreSQL timestamp format
exports.jsToPgTimeStamp = date => {
  function zeroFix(d) {
    return ("0" + d).slice(-2);
  }
  var prop = new Date(date);

  const calcDate = [
    prop.getUTCFullYear(),
    zeroFix(prop.getMonth() + 1),
    zeroFix(prop.getDate())
  ].join("-");
  const calcTime = [
    zeroFix(prop.getHours()),
    zeroFix(prop.getMinutes()),
    zeroFix(prop.getSeconds())
  ].join(":");
  return [calcDate, calcTime].join(" ");
};

//helper for DRY
exports.sendResponse = (dbResponse, res, importantStatus = undefined) => {
  let status;
  if (typeof dbResponse !== "undefined" || dbResponse.length) {
    status = { code: 200, message: "succes" };
    if (importantStatus) status.code = importantStatus;
    if (dbResponse.code) {
      status.code = dbResponse.code;
      delete dbResponse.code;
    }
    if (dbResponse.message) {
      status.message = dbResponse.message;
      delete dbResponse.message;
    }
  } else {
    status = { code: 400, message: "error" };
  }

  res.status(status.code).json({
    status: status.message,
    data: dbResponse
  });
};
