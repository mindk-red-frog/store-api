const Order = require('../models/orgers.model')

class ordersController {

    static  async index (req, res) {
        res.send(await new Order().getList())
    };

    static async create(req, res) {
        let data = req.body;
        let createList = await new Order().create(data)
            .then(() => 'List create');
        res.status(200).send(createList);
    };

    static async read(req, res) {
        let id_name = {'client_id': req.params.id};
        res.send(await new Order().find(id_name))
    };

    static async update(req, res) {
        let id_name = {'client_id': req.params.id};
        let data = req.body;
        let updateList = await new Order().store(id_name, data)
            .then(() => 'update list');
        res.send(updateList);
    };

    static async delete(req, res) {
        let id_name = {'client_id' : req.params.id};
        let message = await new Order().delete(id_name)
            .then(()=> 'List deleted');
        res.status(200).send(message);
    };
}

module.exports = ordersController;



