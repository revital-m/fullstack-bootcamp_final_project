require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(`${process.env.MONGO_URL}`, {}, (error, client) => {
  if (error) {
    console.log(error.message);
  }
  console.log("Successfully connected to MongoDB");
});
