import React, { useState, useRef, useEffect } from "react";
import "./StudyingCreateCard.css";
import MsgBox from "../MsgBox/MsgBox";
import Spinner from "../Spinner/Spinner";
import { v4 as uuidv4 } from "uuid";

const StudyingCreateCard = ({
  categoriesName,
  saveNewCategoryCard,
  saveNewQuestionCard,
}) => {
  const subjects = [
    { name: "HTML", id: uuidv4() },
    { name: "CSS", id: uuidv4() },
    { name: "JS", id: uuidv4() },
    { name: "REACT", id: uuidv4() },
    { name: "NODEJS", id: uuidv4() },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(true);

  //* State for the studying card:
  const [err, setErr] = useState("");
  const [current, setCurrent] = useState(4);
  const [newCategory, setNewCategory] = useState("");
  const [isCategory, setIsCategory] = useState("job-card--label-required");
  const [selectCategory, setSelectCategory] = useState("Select Category");
  const [subjectsSelect, setSubjectsSelect] = useState("Select Subject");
  const [subjectsArr, setSubjectsArr] = useState(subjects);
  const [globalCard, setGlobalCard] = useState(true);
  const [userPrivate, setUserPrivate] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [isQuestionTitle, setIsQuestionTitle] = useState(
    "job-card--label-required"
  );
  const [question, setQuestion] = useState("");
  const [isQuestion, setIsQuestion] = useState("job-card--label-required");
  const [answer, setAnswer] = useState("");
  const [isAnswer, setIsAnswer] = useState("job-card--label-required");

  //* State for the MsgBox component.
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");

  //* Ref, params & history.
  const newCategoryRef = useRef();

  //* Focus on the first input.
  useEffect(() => {
    newCategoryRef.current.focus();
  }, []);

  //* Check if the category is provided.
  useEffect(() => {
    if (
      (newCategory && subjectsSelect !== "Select Subject") ||
      selectCategory !== "Select Category"
    ) {
      setIsCategory("");
    } else {
      setIsCategory("job-card--label-required");
    }
  }, [newCategory, subjectsSelect, selectCategory]);

  //* Check if the question title is provided.
  useEffect(() => {
    if (questionTitle) {
      setIsQuestionTitle("");
    } else {
      setIsQuestionTitle("job-card--label-required");
    }
  }, [questionTitle]);

  //* Check if the answer is provided.
  useEffect(() => {
    if (answer) {
      setIsAnswer("");
    } else {
      setIsAnswer("job-card--label-required");
    }
  }, [answer]);

  //* Check if the question is provided.
  useEffect(() => {
    if (question) {
      setIsQuestion("");
    } else {
      setIsQuestion("job-card--label-required");
    }
  }, [question]);

  //* Check if all of the required fields are provided and call saveNewStudyingCard() to save the card to the Studying collection.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsShow(false);
    setErr("");
    try {
      if (!answer || !question || !questionTitle || isCategory) {
        throw new Error("Required fields are not provided!");
      }
      checkCategory();
      const newQuestion = createNewQuestion();
      console.log("newQuestion: ", newQuestion);
      let response = "";
      if (selectCategory === "Select Category") {
        response = await saveNewCategoryCard(newQuestion);
      } else {
        response = await saveNewQuestionCard(newQuestion);
      }
      checkAxiosResponse(response);
    } catch (error) {
      setCurrent(4);
      setIsLoading(false);
      setErr(error.message);
      setIsShow(true);
    }
  };

  //* Check if the category does not exist already.
  const checkCategory = () => {
    categoriesName.forEach((category) => {
      if (
        category ===
        `${subjectsSelect.toLowerCase()}-${newCategory.toLowerCase()}`
      ) {
        setSelectCategory(category);
      }
    });
  };

  //* Create the new question to send to the server.
  const createNewQuestion = () => {
    const newQuestion = {
      categoryName:
        selectCategory === "Select Category"
          ? `${subjectsSelect}-${newCategory}`
          : selectCategory,
      global: globalCard,
      title: questionTitle,
      question: question,
      answer: answer,
    };
    return newQuestion;
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

  //* Create the existing categories options for the select element.
  const createOptions = () => {
    return categoriesName.map((category) => {
      return (
        <option
          className="studying-card--info"
          key={category.categoryID}
          value={category.categoryName}
        >
          {category.categoryName}
        </option>
      );
    });
  };

  //* Create the subjects options for the select element.
  const createSubjectsArrOptions = () => {
    return subjectsArr.map((subject) => {
      return (
        <option
          className="studying-card--info"
          key={subject.id}
          value={subject.name}
        >
          {subject.name}
        </option>
      );
    });
  };

  //* Controlled Inputs.
  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "newCategory":
        setNewCategory(e.target.value);
        setSelectCategory("Select Category");
        break;
      case "subjectsSelect":
        if (e.target.value !== "Select Subject") {
          setSelectCategory("Select Category");
          setSubjectsSelect(e.target.value);
        } else {
          setSubjectsSelect(e.target.value);
        }
        break;
      case "selectCategory":
        if (e.target.value !== "Select Category") {
          setSelectCategory(e.target.value);
          setNewCategory("");
          setSubjectsSelect("Select Subject");
        } else {
          setSelectCategory(e.target.value);
        }
        break;
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
        if (!globalCard) {
          setUserPrivate(false);
        } else {
          setUserPrivate(true);
        }
        setGlobalCard(!globalCard);
        break;
      case "userPrivate":
        if (!userPrivate) {
          setGlobalCard(false);
        } else {
          setGlobalCard(true);
        }
        setUserPrivate(!userPrivate);
        break;
      default:
        break;
    }
  };

  return (
    <div className="studying-card">
      {isLoading && <Spinner />}
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
          <p className="job-card--required-field">
            All red fields are required.
          </p>
          {err && <p className="job-card--err">{err}</p>}
          <section className="studying-card__checkbox">
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
            <div>
              <input
                className="job-card__timeline--check-mark"
                onChange={handleInputChange}
                type="checkbox"
                name="userPrivate"
                checked={userPrivate}
              ></input>
              <label className="studying-card--label">Private Card</label>
            </div>
          </section>
          <section className="studying-card__category">
            <label className={`studying-card--label ${isCategory}`}>
              Category:
            </label>
            <div className="studying-card__existing-category">
              <label className={`studying-card--label--sub`}>
                Add to an existing category:
              </label>
              <select
                value={selectCategory}
                onChange={handleInputChange}
                name="selectCategory"
                className="studying-card--info"
              >
                <option className="studying-card--info" checked disabled>
                  Select Category
                </option>
                {createOptions()}
              </select>
            </div>
            <div className="studying-card__new-category">
              <label className={`studying-card--label--sub`}>
                Create a new category:
              </label>
              <select
                value={subjectsSelect}
                onChange={handleInputChange}
                name="subjectsSelect"
                className="studying-card--info"
              >
                <option className="studying-card--info" checked disabled>
                  Select Subject
                </option>
                {createSubjectsArrOptions()}
              </select>
              <input
                className={`studying-card--info ${
                  current === 4 ? "studying-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="text"
                name="newCategory"
                placeholder="New category"
                value={newCategory}
                ref={newCategoryRef}
              ></input>
            </div>
          </section>
          <div>
            <label className={`studying-card--label ${isQuestionTitle}`}>
              Question Title:
            </label>
            <input
              className={`studying-card--info ${
                current === 5 ? "studying-card__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="text"
              name="questionTitle"
              value={questionTitle}
            ></input>
          </div>
          <section className="studying-card__q-a">
            <div className="studying-card--textarea">
              <label className={`studying-card--label ${isQuestion}`}>
                Question:
              </label>
              <textarea
                className={`studying-card--info ${
                  current === 6 ? "studying-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                name="question"
                cols="30"
                rows="7"
                value={question}
              ></textarea>
            </div>
            <div className="studying-card--textarea">
              <label className={`studying-card--label ${isAnswer}`}>
                Answer:
              </label>
              <textarea
                className={`studying-card--info ${
                  current === 7 ? "studying-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                name="answer"
                cols="30"
                rows="7"
                value={answer}
              ></textarea>
            </div>
          </section>
          <button
            className={`studying-card--btn ${
              current === 8 ? "studying-card__form--current" : ""
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

export default StudyingCreateCard;
