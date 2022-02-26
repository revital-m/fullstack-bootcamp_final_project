import React from "react";

function QuizSubmit({ setMsgClass, setMessage, setPathBack, setIsLoading, setIsMsgBox, setIsShow, setErr, checkQuiz, quizAnswerArr, setCheckedQuiz, setQuizGrade, setIsStartQuiz, setIsEndQuiz, setIsCheckedQuiz, isLoading }) {
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

  //* display the chosen answers.
  const displayChosenAnswers = () => {
    return quizAnswerArr.map((item, idx) => {
      return (
        <div
          className="quiz--question-option"
          key={item.answerID ? item.answerID : idx}
        >
          <p className="quiz--text">
            <span className="quiz--text-num">{`${idx + 1})`}</span>
            {`${item.optionStr}`}
          </p>
        </div>
      );
    });
  };

  //* Change to the quiz for the user to change his answers.
  const handleEditQuiz = () => {
    setIsEndQuiz(false);
    setIsStartQuiz(true);
  };

  return (
    <form
      className="quiz-container quiz--check-answers"
      onSubmit={handleSubmit}
    >
      <div className="quiz--chosen-answers">{displayChosenAnswers()}</div>
      <div className="quiz-btn-container">
        <button className="quiz--btn" onClick={handleEditQuiz}>
          Edit
        </button>
        <button className="quiz--btn" type="submit" disabled={isLoading}>
          Submit
        </button>
      </div>
    </form>
  );
}

export default QuizSubmit;
