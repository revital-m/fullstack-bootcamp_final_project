require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

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
  jobs: [
    {
      jobID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
  ],
  studying: [
    {
      categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      userQuestions: [
        {
          questionID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        },
      ],
    },
  ],
  exercisesAnswer: [
    {
      questionID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  quizAnswer: [
    {
      questionID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
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

  const token = jwt.sign({ _id: user._id.toString() }, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: "24 hours",
  });

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

const User = mongoose.model("User", userSchema);

module.exports = User;

/** 
 * Check if a password is strong or not. Allows for custom requirements or scoring rules. If returnScore is true, then the function returns an integer score for the password rather than a boolean.
Default options:
{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
*/
