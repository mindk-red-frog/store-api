exports.index = (req, res) => {
  res.send("Products index");
};

exports.create = (req, res) => {
  res.send("Create product");
};

exports.read = (req, res) => {
  res.send("Read product");
};

exports.update = (req, res) => {
  res.send("Update product");
};

exports.delete = (req, res) => {
  res.send("Delete product");
};
