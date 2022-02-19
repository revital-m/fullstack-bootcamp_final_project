import React, { useState, useRef, useEffect } from "react";
import MsgBox from "../MsgBox/MsgBox";
import Spinner from "../Spinner/Spinner";

const StudyingEditCard = ({ updateQuestionCard, chosenStudyingCard }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(true);

  //* State for the studying card:
  const [err, setErr] = useState("");
  const [current, setCurrent] = useState(0);
  const [globalCard, setGlobalCard] = useState(false);
  const [isGlobalCard, setIsGlobalCard] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [placeholderTitle, setPlaceholderTitle] = useState("");
  const [placeholderQuestion, setPlaceholderQuestion] = useState("");
  const [placeholderAnswer, setPlaceholderAnswer] = useState("");

  //* State for the MsgBox component.
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");

  //* Ref, params & history.
  const titleRef = useRef();

  //* Focus on the first input. Check if the card is already global. Set placeholders.
  useEffect(() => {
    titleRef.current.focus();
    setIsGlobalCard(chosenStudyingCard.global);
    setPlaceholderTitle(chosenStudyingCard.title);
    setPlaceholderQuestion(chosenStudyingCard.question);
    setPlaceholderAnswer(chosenStudyingCard.answer);
  }, []);

  //* Check if all of the required fields are provided and call saveNewStudyingCard() to save the card to the Studying collection.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsShow(false);
    setErr("");
    try {
      const updates = createUpdates();
      // console.log("updates: ", updates);
      const response = await updateQuestionCard(updates);
      checkAxiosResponse(response);
    } catch (error) {
      setCurrent(4);
      setIsLoading(false);
      setErr(error.message);
      setIsShow(true);
    }
  };

  //* Create the new question to send to the server.
  const createUpdates = () => {
    const updates = {
      title: questionTitle ? questionTitle : placeholderTitle,
      question: question ? question : placeholderQuestion,
      answer: answer ? answer : placeholderAnswer,
    };
    if (!isGlobalCard && globalCard) {
      updates.global = globalCard;
    }
    return updates;
  };

  //* Check the response from the axios request.
  const checkAxiosResponse = (response) => {
    if (response === 200 || response === 201) {
      setMsgClass("msg--success");
      setMessage("The card was create successfully!");
    } else {
      setMsgClass("msg--error");
      setMessage(`Something went wrong - ${response.status}`);
    }
    setPathBack("/studying");
    setIsLoading(false);
    setIsMsgBox(true);
  };

  //* handel the focus on user's changes.
  const handleEnter = (e) => {
    const form = e.target.form;
    const index = [...form].indexOf(e.target);
    // console.log("index: ", index);
    if (e.type === "click") {
      form.elements[index].focus();
      setCurrent(index);
    } else if (e.key.toLowerCase() === "enter") {
      e.preventDefault();
      form.elements[index + 1].focus();
      setCurrent(index + 1);
    } else {
      form.elements[index].focus();
      setCurrent(index);
    }
  };

  //* Controlled Inputs.
  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "questionTitle":
        setQuestionTitle(e.target.value);
        break;
      case "question":
        setQuestion(e.target.value);
        break;
      case "answer":
        setAnswer(e.target.value);
        break;
      case "globalCard":
        setGlobalCard(!globalCard);
        break;
      default:
        break;
    }
  };

  return (
    <div className="studying-card">
      {isLoading && (
        <Spinner
          spinnerClass="spinner--studying"
          loadingClass="loading--studying"
        />
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
      {isShow && (
        <form className="studying-card-container" onSubmit={handleSubmit}>
          {err && <p className="job-card--err">{err}</p>}
          <section className="studying-card__checkbox studying-card-edit__checkbox">
            {!isGlobalCard && (
              <div>
                <input
                  className="job-card__timeline--check-mark"
                  onChange={handleInputChange}
                  type="checkbox"
                  name="globalCard"
                  checked={globalCard}
                ></input>
                <label className="studying-card--label">Global Card</label>
              </div>
            )}
          </section>
          <div>
            <label className="studying-card--label">Question Title:</label>
            <input
              className={`studying-card--info ${
                current === 0 ? "studying-card__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="text"
              name="questionTitle"
              placeholder={placeholderTitle}
              value={questionTitle}
              ref={titleRef}
            ></input>
          </div>
          <section className="studying-card__q-a">
            <div className="studying-card--textarea">
              <label className="studying-card--label">Question:</label>
              <textarea
                className={`studying-card--info ${
                  current === 1 ? "studying-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                name="question"
                cols="30"
                rows="7"
                placeholder={placeholderQuestion}
                value={question}
              ></textarea>
            </div>
            <div className="studying-card--textarea">
              <label className="studying-card--label">Answer:</label>
              <textarea
                className={`studying-card--info ${
                  current === 2 ? "studying-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                name="answer"
                cols="30"
                rows="7"
                placeholder={placeholderAnswer}
                value={answer}
              ></textarea>
            </div>
          </section>
          <button
            className={`studying-card--btn ${
              current === 3 ? "studying-card__form--current" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default StudyingEditCard;
