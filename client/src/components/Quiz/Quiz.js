import React, { useState, useEffect } from "react";
import "./Quiz.css";
import MsgBox from "../MsgBox/MsgBox";
import Spinner from "../Spinner/Spinner";
import QuizSubmit from "../QuizSubmit/QuizSubmit";
import QuizChecked from "../QuizChecked/QuizChecked";
import QuizStart from "../QuizStart/QuizStart";
import QuizSelectCategory from "../QuizSelectCategory/QuizSelectCategory";

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
          handleGoBackBtn=""
          isDelete={false}
          notDelete={true}
          isClose={false}
        />
      )}
      {!isStartQuiz && !isEndQuiz && isShow && !isCheckedQuiz && (
        <QuizSelectCategory
          selectCategory={selectCategory}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          categoriesArray={categoriesArray}
          setIsLoading={setIsLoading}
          setIsShow={setIsShow}
          setErr={setErr}
          setQuizChosenCategory={setQuizChosenCategory}
          getQuiz={getQuiz}
          setStudyingCategoryId={setStudyingCategoryId}
          setQuizData={setQuizData}
          setIsStartQuiz={setIsStartQuiz}
          err={err}
        />
      )}
      {isStartQuiz && isShow && (
        <QuizStart
          quizChosenCategory={quizChosenCategory}
          quizData={quizData}
          quizDataIdx={quizDataIdx}
          optionsArr={optionsArr}
          setQuizDataIdx={setQuizDataIdx}
          setOptionsArr={setOptionsArr}
          quizAnswerArr={quizAnswerArr}
          setIsEndQuiz={setIsEndQuiz}
          setIsStartQuiz={setIsStartQuiz}
          handleInputChange={handleInputChange}
          setQuizAnswerArr={setQuizAnswerArr}
        />
      )}
      {isShow && isEndQuiz && (
        <QuizSubmit
          setMsgClass={setMsgClass}
          setMessage={setMessage}
          setPathBack={setPathBack}
          setIsLoading={setIsLoading}
          setIsMsgBox={setIsMsgBox}
          setIsShow={setIsShow}
          setErr={setErr}
          checkQuiz={checkQuiz}
          quizAnswerArr={quizAnswerArr}
          setCheckedQuiz={setCheckedQuiz}
          setQuizGrade={setQuizGrade}
          setIsStartQuiz={setIsStartQuiz}
          setIsEndQuiz={setIsEndQuiz}
          setIsCheckedQuiz={setIsCheckedQuiz}
          isLoading={isLoading}
        />
      )}
      {isShow && isCheckedQuiz && (
        <QuizChecked
          checkedQuiz={checkedQuiz}
          quizAnswerArr={quizAnswerArr}
          quizGrade={quizGrade}
        />
      )}
    </div>
  );
};

export default Quiz;
