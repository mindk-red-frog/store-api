module.exports = function AddCRUDController (router, Controller){
    router.get('/', Controller.index);

    router.post('/', Controller.create);

    router.get('/:id', Controller.read);

    router.put('/:id', Controller.update);

    router.delete('/:id', Controller.delete);
};