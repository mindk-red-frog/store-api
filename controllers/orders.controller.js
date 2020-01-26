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
        res.send(await new Order().find(req.params.id))
    };

    static async update(req, res) {
        let data = req.body;
        let updateList = await new Order().store(req.params.id, data)
            .then(() => 'update list');
        res.send(updateList);
    };

    static async delete(req, res) {
        let message = await new Order().delete(req.params.id)
            .then(()=> 'List deleted');
        res.status(200).send(message);
    };
}

module.exports = ordersController;



