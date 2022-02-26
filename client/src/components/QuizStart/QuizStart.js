import React from "react";

function QuizStart({
  quizChosenCategory,
  quizData,
  quizDataIdx,
  optionsArr,
  setQuizDataIdx,
  setOptionsArr,
  quizAnswerArr,
  setIsEndQuiz,
  setIsStartQuiz,
  handleInputChange,
  setQuizAnswerArr
}) {
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

  //* Update the question that is currently shown.
  const handleAnswerClick = (idx) => {
    setQuizDataIdx(idx);
    setOptionsArr([...quizAnswerArr[idx].options]);
  };

  //* Change to the user's answer for him to check them before submitting the quiz.
  const handleCheckBeforeSubmit = () => {
    setIsEndQuiz(true);
    setIsStartQuiz(false);
  };

  //* Update the quizAnswerArr with the option the user has chosen.
  const handleOptionClick = (questionId, optionId, option) => {
    const updateAnswerArr = [...quizAnswerArr];
    updateAnswerArr[quizDataIdx].questionID = questionId;
    updateAnswerArr[quizDataIdx].answerID = optionId;
    updateAnswerArr[quizDataIdx].optionStr = option;
    setQuizAnswerArr(updateAnswerArr);
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

  //* Display the answers for the current quiz.
  const displayAnswers = () => {
    return quizAnswerArr.map((item, idx) => {
      return (
        <div className="quiz--question-option" key={idx}>
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

  //* Display the options for the current question.
  const displayOptions = () => {
    return optionsArr.map((item, idx) => {
      return (
        <div
          className="quiz--question-option"
          key={quizData[quizDataIdx].answers[idx]._id}
        >
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

  return (
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
  );
}

export default QuizStart;
