exports.index = (req, res) => {
  res.send("Orders index");
};

exports.create = (req, res) => {
  res.send("Create order");
};

exports.read = (req, res) => {
  res.send("Read order");
};

exports.update = (req, res) => {
  res.send("Update order");
};

exports.delete = (req, res) => {
  res.send("Delete order");
};
