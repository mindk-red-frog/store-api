class productsController {

    static index (req, res) {
        res.send('index products')
    };

    static create(req, res) {
        res.send('create products')
    };

    static read(req, res) {
        res.send('read products')
    };

    static update(req, res) {
        res.send('update products')
    };

    static delete(req, res) {
        res.send('delete products')
    };
}

module.exports = productsController;
