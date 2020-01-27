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
        let id_name = {'client_id': req.params.id};
        res.send(await new User().find(id_name))
    };

    static async update(req, res) {
        let id_name = {'client_id': req.params.id};
        let data = req.body;
        let updateList = await new User().store(id_name, data)
            .then(() => 'update list');
        res.send(updateList);
    };

    static async delete(req, res) {
        let id_name = {'client_id' : req.params.id};
        let message = await new User().delete(id_name)
            .then(()=> 'List deleted');
        res.status(200).send(message);
    };
}

module.exports = usersController;