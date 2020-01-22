class ordersController {

    static index (req, res) {
        res.send('index order')
    };

    static create(req, res) {
        res.send('create order')
    };

    static read(req, res) {
        let ctx = req.params.id;
        res.send('read order ' + ctx)
    };

    static update(req, res) {
        res.send('update order')
    };

    static delete(req, res) {
        res.send('delete order')
    };
}

module.exports = ordersController;



