import React, { useState } from "react";
import "./StudyingCardsToShow.css";
import FlippedCard from "../FlippedCard/FlippedCard";
import { Link, useHistory, useLocation } from "react-router-dom";

const StudyingCardsToShow = ({ categoryName, categoryData, currentUser, setStudyingCategoryId, categoryId, setChosenStudyingCard, setMsgClass, setMessage, setPathBack, setIsDelete, setIsLoading, setIsShow, setIsMsgBox, setIsRemove }) => {
  const [choosenCard, setChoosenCard] = useState("");
  // const [isShow, setIsShow] = useState(false);
  const [isFlippedCard, setIsFlippedCard] = useState(false);
  // const [isGlobalCard, setIsGlobalCard] = useState(false);
  // const [isMsgBox, setIsMsgBox] = useState(false);
  // const [msgClass, setMsgClass] = useState("");
  // const [message, setMessage] = useState("");
  // const [pathBack, setPathBack] = useState("");
  // const [isClose, setIsClose] = useState(false);
  // const [isDelete, setIsDelete] = useState(false);

  const history = useHistory();

  const handleEdit = (chosenCategoryId, card) => {
    setStudyingCategoryId(chosenCategoryId);
    setChosenStudyingCard(card);
    history.push(`/studying/edit_card`);
  }

  const handleDelete = (chosenCategoryId, card) => {
    setStudyingCategoryId(chosenCategoryId);
    setChosenStudyingCard(card);
    setMsgClass("");
    setMessage(`Are you sure you want to delete this card?`);
    setPathBack("");
    setIsDelete(true);
    setIsLoading(false);
    setIsShow(false);
    setIsMsgBox(true);
    setIsRemove(false);
  }

  const handleRemove = (chosenCategoryId, card) => {
    setStudyingCategoryId(chosenCategoryId);
    setChosenStudyingCard(card);
    setMsgClass("");
    setMessage(`Are you sure you want to delete this card?`);
    setPathBack("");
    setIsDelete(true);
    setIsLoading(false);
    setIsShow(false);
    setIsMsgBox(true);
    setIsRemove(true);
  }

  const displayQuestions = () => {
    return categoryData.map((item) => {
      // console.log("item: ", item);
      // console.log("isGlobalCard: ", isGlobalCard);
      return (
        <div
          key={item._id}
          className="category-card-to-show"
          onClick={() => handleCardClick(item)}
        >
          <div className="category-card--title-container">
            <h3 className="category-card--title">{item.title}</h3>
          </div>
          <div className="category-card--btns">
            {(item.owner === currentUser._id) && (
              <button className="category-card--link" onClick={() => handleEdit(categoryId, item)}>Edit</button>
            )}
            {(item.owner === currentUser._id && !item.global) && (
              <button className="category-card--link" onClick={() => handleDelete(categoryId, item)}>Delete</button>
            )}
            {(item.owner !== currentUser._id || (item.owner === currentUser._id && item.global)) && (
              <button className="category-card--link" onClick={() => handleRemove(categoryId, item)}>Remove</button>
            )}
          </div>
        </div>
      );
    });
  };

  const handleCardClick = (card) => {
    setChoosenCard(card);
    setIsFlippedCard(true);
  };

  const handleClose = () => {
    setIsFlippedCard(false);
  };

  return (
    <div className="category-container">
      <h1 className="category-name">{categoryName}</h1>
      <div className="category--question-container">
        <i
          role="button"
          className="category--arrow fas fa-arrow-alt-circle-left"
        ></i>
        <div className="category--questions">{displayQuestions()}</div>
        <i
          role="button"
          className="category--arrow fas fa-arrow-alt-circle-right"
        ></i>
      </div>
      {isFlippedCard && (
        <i
          className="category--close fas fa-times-circle"
          onClick={handleClose}
        ></i>
      )}
      {isFlippedCard && <FlippedCard card={choosenCard} />}
    </div>
  );
};

export default StudyingCardsToShow;
