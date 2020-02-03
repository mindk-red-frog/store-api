const BaseModel = require('./base.model');

class Role extends BaseModel {
    constructor() {
        super('client')
    }
}

module.exports = Role;
