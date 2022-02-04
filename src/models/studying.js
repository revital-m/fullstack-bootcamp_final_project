const mongoose = require("mongoose");

const studyingSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  questionsArr: [
    {
      global: {
        type: Boolean,
        default: true,
      },
      title: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
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
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    },
  ],
  exercises: [
    {
      question: {
        type: String,
        required: true,
      },
      tests: [
        {
          test: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  quiz: [
    {
      question: {
        type: String,
        required: true,
      },
      answers: [
        {
          option: {
            type: String,
            required: true,
          },
          correct: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],
});

const Studying = mongoose.model("Studying", studyingSchema);

module.exports = Studying;
