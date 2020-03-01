const serviceLocator = require("../utils/service.locator");

class BaseModel {
  constructor(tblName) {
    //console.log(tblName);

    this.table = tblName
      ? serviceLocator.get("db").table(tblName)
      : serviceLocator.get("db");
    //this.table = serviceLocator.get("db").table(tblName);
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
    return this.table
      .where({ id: id })
      .update(content)
      .catch(function(error) {
        console.log(error);

        return error;
      })
      .then(function(response) {
        console.log(response);
        return response;
      });
  }

  insert(content) {
    return this.table.insert(content);
  }
}

module.exports = BaseModel;
