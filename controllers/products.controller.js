const Product = require('../models/products.model');

class productsController {

    static  async index (req, res) {
        res.send(await new Product().getList())
    };

    static async create(req, res) {
        let data = req.body;
        let createList = await new Product().create(data)
            .then(() => 'List create');
        res.status(200).send(createList);
    };

    static async read(req, res) {
        let id_name = {'client_id': req.params.id};
        res.send(await new Product().find(id_name))
    };

    static async update(req, res) {
        let id_name = {'client_id': req.params.id};
        let data = req.body;
        let updateList = await new Product().store(id_name, data)
            .then(() => 'update list');
        res.send(updateList);
    };

    static async delete(req, res) {
        let id_name = {'client_id' : req.params.id};
        let message = await new Product().delete(id_name)
            .then(()=> 'List deleted');
        res.status(200).send(message);
    };
}

module.exports = productsController;
