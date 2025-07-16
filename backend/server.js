const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB CONNECTION SUCCESSFUL");
});

const port = process.env.PORT || 8001;

app.listen(port, (req, res) => {
  console.log(`App running on the port ${port}`);
});
