const mongoose = require("mongoose");
const validator = require("validator");

const jobsSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  contacts: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      validate(value) {
        if (!validator.isMobilePhone(value, "he-IL")) {
          throw new Error("Phone is invalid");
        }
      },
    },
  },
  moreInfo: [
    {
      createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
      },
      info: {
        type: String,
        required: true,
      },
    },
  ],
  timeline: {
    sendCV: {
      type: Boolean,
      default: true,
    },
    gotCallback: {
      type: Boolean,
      default: false,
    },
    interview: {
      type: Boolean,
      default: false,
    },
    negotiation: {
      type: Boolean,
      default: false,
    },
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Jobs = mongoose.model("Jobs", jobsSchema);

module.exports = Jobs;
