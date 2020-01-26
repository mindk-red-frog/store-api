const serviceLocator = require('../services/service.locator');

class BaseModel {

    constructor(tableName) {
        this.table = serviceLocator
            .get('db')
            .table(tableName);

    }

    getList() {
        return this.table.select('*')
    }

    find(id) {
        return this.table.select('*')
            .where('id', id)
            .first()
    }

    delete(id) {
        return this.table.where('id', id)
            .del()
    }

    create(data) {
        return this.table.insert(data)
    }

    store(id, data) {
        return this.table.where({'id' : id})
            .update(data)
    }

}

module.exports = BaseModel