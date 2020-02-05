const serviceLocator = require("../utils/service.locator");

class BaseModel {
  constructor(tblName) {
    this.table = serviceLocator.get("db").table(tblName);
  }
  getAllList() {
    return this.table.select("*");
  }
  delete(id) {
    return this.table.where({ id: id }).del();
  }
  find(id) {
    return this.table
      .where({
        id: id
      })
      .select("*");
  }
  update(id, content) {
    return this.table.where({ id: id }).update(content);
  }
  insert(content) {
    return this.table.insert(content);
  }
}

module.exports = BaseModel;
