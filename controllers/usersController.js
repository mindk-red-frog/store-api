exports.index = (req, res) => {
  res.send("Users index");
};

exports.create = (req, res) => {
  res.send("Create user");
};

exports.read = (req, res) => {
  res.send("Read user");
};

exports.update = (req, res) => {
  res.send("Update user");
};

exports.delete = (req, res) => {
  res.send("Delete user");
};
