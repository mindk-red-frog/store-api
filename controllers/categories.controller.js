class categoriesController {

    static index (req, res) {
        res.send('index categories')
    };

    static create(req, res) {
        res.send('create categories')
    };

    static read(req, res) {
        res.send('read categories')
    };

    static update(req, res) {
        res.send('update categories')
    };

    static delete(req, res) {
        res.send('delete categories')
    };
}
module.exports = categoriesController;