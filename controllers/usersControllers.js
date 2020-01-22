class usersController {

    static index (req, res) {
        res.send('index users')
    };

    static create(req, res) {
        res.send('create users')
    };

    static read(req, res) {
        res.send('read users')
    };

    static update(req, res) {
        res.send('update users')
    };

    static delete(req, res) {
        res.send('delete users')
    };
}

module.exports = usersController;