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

// studyingSchema.virtual("userCategory", {
//   ref: "User",
//   localField: "categoryName",
//   foreignField: "categoryName",
// });

// studyingSchema.virtual("userExercises", {
//   ref: "User",
//   localField: "exercises._id",
//   foreignField: "exercisesQuestionID",
// });

// studyingSchema.virtual("userQuiz", {
//   ref: "User",
//   localField: "quiz._id",
//   foreignField: "quizQuestionID",
// });


//* Filter the questions in each category to only contain the ones that the user has.
// studyingSchema.methods.filterQuestionByCategory = async function(userArr, categoriesArr) {
//     console.log("filterQuestionByCategory: ",this);

// };

const Studying = mongoose.model("Studying", studyingSchema);

module.exports = Studying;
