const BaseModel = require('./base.model');

class Product extends BaseModel {
    constructor() {
        super('client')
    }
}

module.exports = Product;