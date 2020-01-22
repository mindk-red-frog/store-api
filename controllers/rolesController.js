class rolesController {

    static index (req, res) {
        res.send('index roles')
    };

    static create(req, res) {
        res.send('create roles')
    };

    static read(req, res) {
        res.send('read roles')
    };

    static update(req, res) {
        res.send('update roles')
    };

    static delete(req, res) {
        res.send('delete roles')
    };
}
module.exports = rolesController;
