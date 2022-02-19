import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Quiz.css";
import MsgBox from "../MsgBox/MsgBox";
import Spinner from "../Spinner/Spinner";

const Quiz = ({
  addQuestionToQuiz,
  userStudyingArr,
  getQuiz,
  setStudyingCategoryId,
  checkQuiz,
}) => {
  //* State:
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [isStartQuiz, setIsStartQuiz] = useState(false);
  const [isEndQuiz, setIsEndQuiz] = useState(false);
  const [isCheckedQuiz, setIsCheckedQuiz] = useState(false);

  //* Initializes answers array for the quiz.
  const answersArr = [
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
    {
      questionID: "",
      answerID: "",
      optionStr: "",
      value: false,
      options: [false, false, false, false],
      correct: false,
    },
  ];

  //* State for the studying card:
  const [err, setErr] = useState("");
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [selectCategory, setSelectCategory] = useState("Select Category");
  const [quizChosenCategory, setQuizChosenCategory] = useState("");
  const [quizAnswerArr, setQuizAnswerArr] = useState(answersArr);
  const [quizData, setQuizData] = useState([]);
  const [quizDataIdx, setQuizDataIdx] = useState(0);
  const [optionsArr, setOptionsArr] = useState([false, false, false, false]);
  const [checkedQuiz, setCheckedQuiz] = useState([]);
  const [quizGrade, setQuizGrade] = useState(0);

  //* State for the MsgBox component.
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");

  //* Create the options for the category selection.
  useEffect(() => {
    const quizCategories = [];
    userStudyingArr.forEach((category) => {
      const categoryNameArr = category.categoryName.split("-");
      const categoryNameStr = `${categoryNameArr[0].toUpperCase()}-${categoryNameArr[1].toLowerCase()}`;
      const categoryObj = {
        categoryName: categoryNameStr,
        categoryID: category._id,
      };
      if (category.quiz.length) {
        quizCategories.push(categoryObj);
      }
      // quizCategories.push(categoryObj);
    });
    setCategoriesArray(quizCategories);
  }, []);

  //* Change to the user's answer for him to check them before submitting the quiz.
  const handleCheckBeforeSubmit = () => {
    setIsEndQuiz(true);
    setIsStartQuiz(false);
  };

  //* Change to the quiz for the user to change his answers.
  const handleEditQuiz = () => {
    setIsEndQuiz(false);
    setIsStartQuiz(true);
  };

  //* Check if all of the required fields are provided and call saveNewStudyingCard() to save the card to the Studying collection.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsShow(false);
    setErr("");
    try {
      const response = await checkQuiz(quizAnswerArr);
      if (response.status === 200) {
        setCheckedQuiz(response.data[0].answersArr);
        setQuizGrade(response.data[0].usersGrade * 10);
        setIsShow(true);
        setIsStartQuiz(false);
        setIsEndQuiz(false);
        setIsCheckedQuiz(true);
        setIsLoading(false);
      } else {
        checkAxiosResponse(response);
      }
    } catch (error) {
      console.table(error);
      setIsLoading(false);
      setErr(error.message);
      setIsShow(true);
    }
  };

  //* Check the response from the axios request.
  const checkAxiosResponse = (response) => {
    if (response.status === 200 || response.status === 201) {
      setMsgClass("msg--success");
      setMessage("The card was create successfully!");
    } else {
      console.table(response);
      setMsgClass("msg--error");
      setMessage(`Something went wrong - ${response.response.data}`);
    }
    setPathBack("/studying/quiz");
    setIsLoading(false);
    setIsMsgBox(true);
  };

  //* Controlled Inputs.
  const handleInputChange = (e) => {
    if (e.target.name === "selectCategory") {
      setSelectCategory(e.target.value);
    } else {
      const updateAnswerArr = [...quizAnswerArr];
      const updateOptionsArr = optionsArr.map((item, idx) => {
        if (e.target.name === `${idx}`) {
          updateAnswerArr[quizDataIdx].value = !item;
          if (`${idx}` === `0`) {
            updateAnswerArr[quizDataIdx].correct = !item;
          }
          return !item;
        } else {
          return false;
        }
      });
      updateAnswerArr[quizDataIdx].options = updateOptionsArr;
      setOptionsArr(updateOptionsArr);
      setQuizAnswerArr(updateAnswerArr);
    }
  };

  //* Get the quiz by the chosen category.
  const handleStartQuiz = async () => {
    setIsLoading(true);
    setIsShow(false);
    // addQuestionToQuiz(selectCategory);
    try {
      setErr("");
      if (selectCategory === "Select Category") {
        throw new Error("You must choose a category to start the quiz");
      }
      categoriesArray.forEach((category) => {
        if (category.categoryID === selectCategory) {
          setQuizChosenCategory(category.categoryName);
        }
      });
      const response = await getQuiz(selectCategory);
      setStudyingCategoryId(selectCategory);
      setQuizData(response);
      setIsStartQuiz(true);
      setIsLoading(false);
      setIsShow(true);
    } catch (error) {
      setIsLoading(false);
      setErr(error.message);
      setIsShow(true);
    }
  };

  //* Update the quizAnswerArr with the option the user has chosen.
  const handleOptionClick = (questionId, optionId, option) => {
    const updateAnswerArr = [...quizAnswerArr];
    updateAnswerArr[quizDataIdx].questionID = questionId;
    updateAnswerArr[quizDataIdx].answerID = optionId;
    updateAnswerArr[quizDataIdx].optionStr = option;
    setQuizAnswerArr(updateAnswerArr);
  };

  //* Update the question that is currently shown.
  const handleAnswerClick = (idx) => {
    setQuizDataIdx(idx);
  };

  //* Update the question that is currently shown.
  const handleArrowClick = (idx) => {
    if (idx < 0) {
      idx = 0;
    } else if (idx > 9) {
      idx = 9;
    }
    setQuizDataIdx(idx);
    setOptionsArr(quizAnswerArr[idx].options);
  };

  //* Create the categories options for the select element.
  const createOptions = () => {
    return categoriesArray.map((category) => {
      return (
        <option
          className="studying-card--info"
          key={category.categoryID}
          value={category.categoryID}
        >
          {category.categoryName}
        </option>
      );
    });
  };

  //* Display the options for the current question.
  const displayQuestions = () => {
    return (
      <div key={quizData[quizDataIdx]._id}>
        <div className="quiz--title">
          <h2 className="category-card--title">{`Question ${
            quizDataIdx + 1
          }:`}</h2>
          <h3 className="category-card--title">
            {quizData[quizDataIdx].question}
          </h3>
        </div>
        <div className="quiz--question">{displayOptions()}</div>
      </div>
    );
  };

  //* Display the options for the current question.
  const displayOptions = () => {
    return optionsArr.map((item, idx) => {
      return (
        <div className="quiz--question-option" key={quizData[quizDataIdx].answers[idx]._id} >
          <input
            className="quiz--check-mark"
            onChange={handleInputChange}
            onClick={() =>
              handleOptionClick(
                quizData[quizDataIdx]._id,
                quizData[quizDataIdx].answers[idx]._id,
                quizData[quizDataIdx].answers[idx].option
              )
            }
            type="checkbox"
            name={idx}
            checked={item}
          ></input>
          <label className="quiz--label quiz--option">
            {quizData[quizDataIdx].answers[idx].option}
          </label>
        </div>
      );
    });
  };

  //* Display the answers for the current quiz.
  const displayAnswers = () => {
    return quizAnswerArr.map((item, idx) => {
      // console.log("item: ", item);
      return (
        <div className="quiz--question-option" key={idx} >
          <input
            className="quiz--check-mark"
            readOnly
            onClick={() => handleAnswerClick(idx)}
            type="checkbox"
            name={`quizAnswer${idx + 1}`}
            checked={item.value}
          ></input>
          <label
            className="quiz--label quiz--option"
            onClick={() => handleAnswerClick(idx)}
          >
            {`Question ${idx + 1}`}
          </label>
        </div>
      );
    });
  };

  //* display the chosen answers.
  const displayChosenAnswers = () => {
    return quizAnswerArr.map((item, idx) => {
      return (
        <div className="quiz--question-option" key={item.answerID ? item.answerID : idx} >
          <p className="quiz--text">
            <span className="quiz--text-num">{`${idx + 1})`}</span>
            {`${item.optionStr}`}
          </p>
        </div>
      );
    });
  };

  //* display the checked quiz.
  const displayCheckedQuizAnswer = () => {
    return checkedQuiz.map((item, idx) => {
      // console.log("item: ", item);
      return (
        <div className="quiz--checked-answer" key={`${item.questionID}${item.userAnswer}`} >
          <p className={`quiz--icon-${item.correct ? "check" : "x"}`}></p>
          <p className={`quiz--text`}>
            <span
              className={`quiz--text-num quiz--text-${
                item.correct ? "green" : "red"
              }`}
            >{`Q${idx + 1} - `}</span>
            {`${quizAnswerArr[idx].optionStr}`}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="quiz">
      {isLoading && (
        <Spinner spinnerClass="spinner--quiz" loadingClass="loading--quiz" />
      )}
      {isMsgBox && (
        <MsgBox
          msgClass={msgClass}
          message={message}
          pathBack={pathBack}
          handleDelete=""
          handleGoBackbtn=""
          isDelete={false}
          notDelete={true}
          isClose={false}
        />
      )}
      {!isStartQuiz && !isEndQuiz && isShow && !isCheckedQuiz && (
        <div className="quiz-container start-quiz">
          <div className="studying-card__existing-category">
            {err && <p className="job-card--err">{err}</p>}
            <label className="quiz--label">
              Please select a category to start the quiz:
            </label>
            <select
              value={selectCategory}
              onChange={handleInputChange}
              name="selectCategory"
              className="quiz--info"
            >
              <option className="quiz--info" checked disabled>
                Select Category
              </option>
              {createOptions()}
            </select>
          </div>
          <button
            className="quiz--btn"
            disabled={isLoading}
            onClick={handleStartQuiz}
          >
            Start Quiz
          </button>
        </div>
      )}
      {isStartQuiz && isShow && (
        <div className="quiz__info">
          <main className="quiz__info--questions-title quiz-container">
            <h1 className="quiz__info--category">{quizChosenCategory}</h1>
            <div className="quiz__info--questions">{displayQuestions()}</div>
            <div className="quiz-btn-container">
              <i
                role="button"
                className="quiz--arrow fas fa-arrow-alt-circle-left"
                onClick={() => handleArrowClick(quizDataIdx - 1)}
              ></i>
              <i
                role="button"
                className="quiz--arrow fas fa-arrow-alt-circle-right"
                onClick={() => handleArrowClick(quizDataIdx + 1)}
              ></i>
            </div>
          </main>
          <aside className="quiz__info--answers-submit quiz-container">
              <div className="quiz-answers">{displayAnswers()}</div>
              <button className="quiz--btn" onClick={handleCheckBeforeSubmit}>
                Submit
              </button>
          </aside>
        </div>
      )}
      {isShow && isEndQuiz && (
        <form className="quiz-container quiz--check-answers" onSubmit={handleSubmit}>
          <div className="quiz-answers">{displayChosenAnswers()}</div>
          <div className="quiz-btn-container">
            <button className="quiz--btn" onClick={handleEditQuiz}>
              Edit
            </button>
            <button className="quiz--btn" type="submit" disabled={isLoading}>
              Submit
            </button>
          </div>
        </form>
      )}
      {isShow && isCheckedQuiz && (
        <div className="quiz-container quiz--check-answers">
          <div className="quiz-btn-container">
            <h1>{`Your Grade Is: ${quizGrade}/100`}</h1>
            <Link className="quiz--btn" to="/studying">
              Back
            </Link>
          </div>
          <div className="quiz-answers">{displayCheckedQuizAnswer()}</div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
