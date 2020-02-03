const BaseModel = require('./base.model');

class User extends BaseModel {
    constructor() {
        super('client')
    }
}

module.exports = User;