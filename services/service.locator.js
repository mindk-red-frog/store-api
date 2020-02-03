let instance = null;

class ServiceLocator {
    constructor() {
        this.providers = {}
    }

    register(providerName, service) {
        this.providers[providerName] = service
    }

    get(providerName) {
        return this.providers[providerName]
    }
}

instance = new ServiceLocator();

module.exports = instance;