let instance = null;

class ServiceLocator {
  constructor() {
    this.conectionOptions = {};
  }
  register(connectionType, serviceName) {
    this.conectionOptions[connectionType] = serviceName;
  }

  get(connectionType) {
    return this.conectionOptions[connectionType];
  }
}

instance = new ServiceLocator();
module.exports = instance;
