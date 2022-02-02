const express = require("express");
require("./src/db/mongoose");
const userRoute = require("./src/routers/userRoute");
const jobsRoute = require("./src/routers/jobsRoute");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(userRoute);
app.use(jobsRoute);
const publicPath = path.join(__dirname, "client/build");

app.use(express.static(publicPath));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is up on port - ${port}`);
});
