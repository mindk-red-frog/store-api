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
        res.send(await new Product().find(req.params.id))
    };

    static async update(req, res) {
        let data = req.body;
        let updateList = await new Product().store(req.params.id, data)
            .then(() => 'update list');
        res.send(updateList);
    };

    static async delete(req, res) {
        let message = await new Product().delete(req.params.id)
            .then(()=> 'List deleted');
        res.status(200).send(message);
    };
}

module.exports = productsController;
