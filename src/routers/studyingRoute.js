const express = require("express");
const Studying = require("../models/studying");
const auth = require("../middleware/auth");
const router = express.Router();

//! CRUD for the studying cards:
//* Get all of the global studying cards by category.
router.post("/api/studying/globalCategories", auth, async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    const categoryArr = await Studying.find({}).sort({ _id: 1 });
    if (!categoryArr) {
      throw new Error("Global categories not found");
    }

    // Loop over the categoryArr from the Studying collection & add all of the chosen categories global questions.
    const globalMap = new Map();
    categoryArr.forEach((category) => {
      const isInclude = req.body.categoriesArr.find(
        (id) => id === category._id.valueOf()
      );
      if (isInclude) {
        const globalQuestionsArr = category.questionsArr.filter(
          (question) => question.global === true
        );
        globalMap.set(category._id.valueOf(), globalQuestionsArr);
      }
    });

    // Loop over the studying array from the User collection & add all of the chosen categories global questions. into a set ( for unique questions only. ) and then into the userQuestions array.
    req.user.studying.forEach((category) => {
      const globalCards = globalMap.get(category.categoryID);
      if (globalCards) {
        const cardsSet = new Set();
        globalCards.forEach((question) => cardsSet.add(question._id.valueOf()));
        category.userQuestions.forEach((question) => {
          if (!cardsSet.has(question.questionID.valueOf())) {
            cardsSet.add(question.questionID.valueOf());
          }
        });
        const updatedArr = [];
        cardsSet.forEach((item) => {
          updatedArr.push({ questionID: item });
        });
        category.userQuestions = updatedArr;
      }
    });

    await req.user.save();
    res.status(200).send(req.user.studying);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Add a new category card to the database.
router.post("/api/studying/creatNewCategory", auth, async (req, res) => {
  try {
    const category = new Studying({
      categoryName: req.body.categoryName,
      questionsArr: {
        global: req.body.global,
        title: req.body.title,
        question: req.body.question,
        answer: req.body.answer,
        owner: req.user._id,
      },
    });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//* Add a new card to an existing category in the database.
router.patch("/api/studying/creatNewCard", auth, async (req, res) => {
  try {
    const newCard = await Studying.findOne({
      categoryName: req.body.categoryName,
    });
    if (!newCard) {
      throw new Error(`Category not found`);
    }
    newCard.questionsArr.push({
      global: req.body.global,
      title: req.body.title,
      question: req.body.question,
      answer: req.body.answer,
      owner: req.user._id,
    });
    await newCard.save();
    res.status(201).send(newCard);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//* Get all of the user's studying cards by category.
router.get("/api/studying/allCategories", auth, async (req, res) => {
  try {
    const categoryArr = await Studying.find({}).sort({ _id: 1 });
    if (!categoryArr) {
      throw new Error("Categories not found");
    }
    const sortUserArr = req.user.studying.sort(
      (a, b) => a.categoryID - b.categoryID
    );
    const filteredArr = [];

    for (let i = 0, k = 0; k < sortUserArr.length; i++) {
      const filteredQuestionArr = [];
      if (categoryArr[i]._id.valueOf() === sortUserArr[k].categoryID) {
        sortUserArr[k].userQuestions.sort(
          (a, b) => a.questionID.valueOf() - b.questionID.valueOf()
        );
        for (let j = 0, l = 0; l < sortUserArr[k].userQuestions.length; j++) {
          if (
            categoryArr[i].questionsArr[j]._id.valueOf() ===
            sortUserArr[k].userQuestions[l].questionID.valueOf()
          ) {
            filteredQuestionArr.push(categoryArr[i].questionsArr[j]);
            l++;
          }
        }
        categoryArr[i].questionsArr = filteredQuestionArr;
        filteredArr.push(categoryArr[i]);
        k++;
      }
    }

    res.status(200).send(filteredArr);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
    // res.status(500).send(error.message);
  }
});

//* Get all the categories names.
router.get("/api/studying/categoriesName", auth, async (req, res) => {
  try {
    const studying = await Studying.find({});
    if (!studying) {
      throw new Error("Global categories not found");
    }
    const globalArr = [];
    studying.forEach((category) => {
      globalArr.push({
        categoryName: category.categoryName,
        categoryID: category._id.valueOf(),
      });
    });

    res.status(200).send(globalArr);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//* Update the current user's specific card.
router.patch(
  "/api/studying/updateCard/:cardId/:categoryId",
  auth,
  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["global", "title", "question", "answer"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
      const category = await Studying.findOne({ _id: req.params.categoryId });
      if (!category) {
        return res.status(404).send({ error: "Card not found!" });
      }
      const cardToUpdate = [];
      category.questionsArr.forEach((card) => {
        if (
          card.owner.valueOf() === req.user._id.valueOf() &&
          card._id.valueOf() === req.params.cardId
        ) {
          updates.forEach((update) => (card[update] = req.body[update]));
          return cardToUpdate.push(card);
        }
      });
      if (!cardToUpdate.length) {
        return res.status(404).send({ error: "Card not found!" });
      }

      await category.save();
      res.status(200).send(cardToUpdate);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//* Remove the current user's specific card from his array.
router.delete(
  "/api/studying/removeCardFromUser/:cardId/:categoryId",
  auth,
  async (req, res) => {
    try {
      const cardToRemove = [];
      req.user.studying.forEach((card) => {
        if (card.categoryID === req.params.categoryId) {
          const filteredQuestionArr = card.userQuestions.filter(
            (question) => question.questionID.valueOf() !== req.params.cardId
          );
          const removedCard = card.userQuestions.filter(
            (question) => question.questionID.valueOf() === req.params.cardId
          );
          cardToRemove.push(removedCard);
          return (card.userQuestions = filteredQuestionArr);
        }
      });
      if (!cardToRemove.length) {
        return res.status(404).send({ error: "Card not found!" });
      }

      await req.user.save();
      res.status(200).send([req.user, cardToRemove]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//* Delete the current user's specific card from the Studying collection.
router.delete(
  "/api/studying/deleteCardFromStudying/:cardId/:categoryId",
  auth,
  async (req, res) => {
    try {
      const category = await Studying.findOne({ _id: req.params.categoryId });
      if (!category) {
        return res.status(404).send({ error: "Card not found!" });
      }
      const cardToDelete = [];
      const filteredQuestionArr = category.questionsArr.filter((card) => {
        return !(
          card.owner.valueOf() === req.user._id.valueOf() &&
          card._id.valueOf() === req.params.cardId &&
          card.global === false
        );
      });
      const deletedCard = category.questionsArr.filter((card) => {
        return (
          card.owner.valueOf() === req.user._id.valueOf() &&
          card._id.valueOf() === req.params.cardId &&
          card.global === false
        );
      });
      cardToDelete.push(deletedCard);
      category.questionsArr = filteredQuestionArr;

      if (!cardToDelete.length) {
        return res.status(404).send({ error: "Card not found!" });
      }

      await category.save();
      res.status(200).send(cardToDelete);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//! CRUD for the quiz:
//* Add questions to the quiz by category.
router.patch(
  "/api/studying/quizQuestion/:categoryId",
  auth,
  async (req, res) => {
    try {
      const category = await Studying.findOne({ _id: req.params.categoryId });
      if (!category) {
        throw new Error("Category not found");
      }
      const answersArr = req.body.optionsArr.map((item) => {
        return {
          option: item.answer,
          correct: item.correct,
        };
      });
      const newQuestion = {
        question: req.body.question,
        answers: answersArr,
      };
      category.quiz.push(newQuestion);

      await category.save();
      res.status(200).send(category.quiz);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//* Get the quiz questions by category.
router.get(
  "/api/studying/quizByCategory/:categoryId",
  auth,
  async (req, res) => {
    try {
      const category = await Studying.findOne({ _id: req.params.categoryId });
      if (!category) {
        throw new Error("Category not found");
      }

      res.status(200).send(category.quiz);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//* Update a specific question in the quiz.
router.patch(
  "/api/studying/updateQuizQuestion/:categoryId/:questionId",
  auth,
  async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ["question", "0", "1", "2", "3"];
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
      }
      const category = await Studying.findOne({ _id: req.params.categoryId });
      if (!category) {
        throw new Error("Category not found");
      }

      category.quiz.forEach((quizQ) => {
        if (quizQ._id.valueOf() === req.params.questionId) {
          updates.forEach((update) => {
            if (update === "question") {
              quizQ.question = req.body[update];
            } else {
              if (req.body[update][0]) {
                quizQ.answers[update].option = req.body[update][0];
              }
              if (req.body[update][1] !== -1) {
                quizQ.answers[update].correct = req.body[update][1];
              }
            }
          });
          return quizQ.answers.sort((a, b) => b.correct - a.correct);
        }
      });

      await category.save();
      res.status(200).send(category.quiz);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//* Delete a specific question in the quiz.
router.delete(
  "/api/studying/deleteQuizQuestion/:categoryId/:questionId",
  auth,
  async (req, res) => {
    try {
      const category = await Studying.findOne({ _id: req.params.categoryId });
      if (!category) {
        throw new Error("Category not found");
      }

      const filteredQuestionArr = category.quiz.filter(
        (quizQ) => quizQ._id.valueOf() !== req.params.questionId
      );
      const deleteQuizQuestion = category.quiz.filter(
        (quizQ) => quizQ._id.valueOf() === req.params.questionId
      );
      category.quiz = filteredQuestionArr;
      if (!deleteQuizQuestion) {
        throw new Error("Question not found");
      }

      await category.save();
      res.status(200).send([category.quiz, deleteQuizQuestion]);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

//* Check the user's answers and update the importance.
router.patch("/api/studying/checkQuiz/:categoryId", auth, async (req, res) => {
  try {
    const category = await Studying.findOne({ _id: req.params.categoryId });
    if (!category) {
      throw new Error("Category not found");
    }

    const userAnswersMap = new Map();
    req.body.userAnswers.forEach((question) =>
      userAnswersMap.set(question.questionID, question.answerID)
    );

    const checkedQuiz = { usersGrade: 0, answersArr: [] };
    category.quiz.forEach((question) => {
      const answerID = userAnswersMap.get(question._id.valueOf());
      const checkedObj = {
        questionID: question._id.valueOf(),
        userAnswer: answerID,
        correct: "",
      };
      if (question.answers[0]._id.valueOf() === answerID) {
        checkedQuiz.usersGrade++;
        checkedObj.correct = true;
      } else {
        checkedObj.correct = false;
      }
      checkedQuiz.answersArr.push(checkedObj);
    });

    req.user.studying.forEach((card) => {
      if (card.categoryID === req.params.categoryId) {
        return (card.importance = Math.floor(checkedQuiz.usersGrade / 2));
      }
    });

    await req.user.save();
    res.status(200).send([checkedQuiz, Math.floor(checkedQuiz.usersGrade / 2)]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
