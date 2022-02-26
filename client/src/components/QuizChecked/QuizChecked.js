import React from "react";
import { Link } from "react-router-dom";

function QuizChecked({ checkedQuiz, quizAnswerArr, quizGrade }) {
  //* display the checked quiz.
  const displayCheckedQuizAnswer = () => {
    return checkedQuiz.map((item, idx) => {
      return (
        <div
          className="quiz--checked-answer"
          key={`${item.questionID}${item.userAnswer}`}
        >
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
    <div className="quiz-container quiz--check-answers">
      <div className="quiz-btn-container">
        <h1>{`Your Grade Is: ${quizGrade}/100`}</h1>
        <Link className="quiz--btn" to="/studying">
          Back
        </Link>
      </div>
      <div className="quiz--chosen-answers">{displayCheckedQuizAnswer()}</div>
    </div>
  );
}

export default QuizChecked;
