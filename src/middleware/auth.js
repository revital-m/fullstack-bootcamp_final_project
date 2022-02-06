require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

//* Check if the user is authenticated to get the data.
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    // console.log("token: ", token);
    const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    // console.log("decoded: ", decoded);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": `${token}`,
    });

    // console.log("user: ", user);
    if (!user) {
      console.log("User Not found!");
      throw new Error("User Not found!");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error);
    // res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
