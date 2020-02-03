const BaseModel = require('./base.model');

class Order extends BaseModel {
    constructor() {
        super('client')
    }
}

module.exports = Order;