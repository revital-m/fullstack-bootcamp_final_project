require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Jobs = require("./jobs");
const Studying = require("../models/studying");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password is not strong enough");
      }
    },
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  studying: [
    {
      categoryID: {
        type: String,
        required: true,
        ref: "Studying",
      },
      importance: {
        type: Number,
        default: 0,
        validate(value) {
          if (value < 0 || value > 5) {
            throw new Error("Importance is invalid");
          }
        },
      },
      userQuestions: [
        {
          questionID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Studying",
          },
        },
      ],
    },
  ],
  exercisesAnswer: [
    {
      exercisesQuestionID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Studying",
      },
      answer: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
      },
    },
  ],
});

userSchema.virtual("jobs", {
  ref: "Jobs",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("studyingCard", {
  ref: "Studying",
  localField: "_id",
  foreignField: "owner",
});

//* Remove confidential information from the response that the user is going to get back.
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

//* Generate Authentication Token for the user.
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toString() },
    `${process.env.ACCESS_TOKEN_SECRET}`
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//* Find a user by his email & password.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//* Hash the plain password before saving.
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//* Delete the user's jobs when the user is removed.
userSchema.pre("remove", async function (next) {
  const user = this;
  await Jobs.deleteMany({ owner: user._id });
  await Studying.deleteMany({ "questionsArr.owner": user._id });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
