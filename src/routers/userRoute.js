const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = express.Router();

//* Add a new user to the database, by userName, email & password.
router.post("/api/users/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//* Login with an existing user, by email & password.
router.post("/api/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//* Logout the current user.
router.post("/api/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).send("User logged out successfully.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Logout the current user from all his tokens.
router.post("/api/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("User logged out successfully.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Get a user's profile.
router.get("/api/users/myProfile", auth, async (req, res) => {
  res.status(200).send(req.user);
});

//* Update the current user's profile (name, email & password).
router.patch("/api/users/updateProfile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["userName", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Delete the current user from the database.
router.delete("/api/users/deleteProfile", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
