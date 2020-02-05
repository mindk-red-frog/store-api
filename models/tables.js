const BaseModel = require("./base.model");

class Tables extends BaseModel {
  constructor(tblModel) {
    //super("products");
    super(tblModel);
    tblModel;
  }
}

module.exports = Tables;
