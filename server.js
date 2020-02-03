const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");
// Start a Server

const port = process.env.PORT || 3000; //3000 - config.env
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
