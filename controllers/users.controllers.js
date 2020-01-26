const User = require('../models/users.model');

class usersController {

    static  async index (req, res) {
        res.send(await new User().getList())
    };

    static async create(req, res) {
        let data = req.body;
        let createList = await new User().create(data)
            .then(() => 'List create');
        res.status(200).send(createList);
    };

    static async read(req, res) {
        res.send(await new User().find(req.params.id))
    };

    static async update(req, res) {
        let data = req.body;
        let updateList = await new User().store(req.params.id, data)
            .then(() => 'update list');
        res.send(updateList);
    };

    static async delete(req, res) {
        let message = await new User().delete(req.params.id)
            .then(()=> 'List deleted');
        res.status(200).send(message);
    };
}

module.exports = usersController;