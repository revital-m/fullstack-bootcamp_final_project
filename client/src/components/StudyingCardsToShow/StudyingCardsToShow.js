import React, { useState } from "react";
import "./StudyingCardsToShow.css";
import FlippedCard from "../FlippedCard/FlippedCard";
import { useHistory } from "react-router-dom";

const StudyingCardsToShow = ({
  categoryName,
  categoryData,
  currentUser,
  setStudyingCategoryId,
  categoryId,
  setChosenStudyingCard,
  setMsgClass,
  setMessage,
  setPathBack,
  setIsDelete,
  setIsLoading,
  setIsShow,
  setIsMsgBox,
  setIsRemove,
  cardImportance,
}) => {
  //* State:
  const [chosenCard, setChosenCard] = useState("");
  const [isFlippedCard, setIsFlippedCard] = useState(false);

  //* Use history.
  const history = useHistory();

  //* Move the user to the edit card page.
  const handleEdit = (chosenCategoryId, card) => {
    setStudyingCategoryId(chosenCategoryId);
    setChosenStudyingCard(card);
    history.push(`/studying/edit_card`);
  };

  //* Create the message for the user to see if he is sure he we to delete the card.
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
  };

  //* Create the message for the user to see if he is sure he we to remove the card.
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
  };

  //* Display the questions in this category.
  const displayQuestions = () => {
    return categoryData.map((item) => {
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
            {item.owner === currentUser._id && (
              <button
                className="category-card--link"
                onClick={() => handleEdit(categoryId, item)}
              >
                Edit
              </button>
            )}
            {item.owner === currentUser._id && !item.global && (
              <button
                className="category-card--link"
                onClick={() => handleDelete(categoryId, item)}
              >
                Delete
              </button>
            )}
            {(item.owner !== currentUser._id ||
              (item.owner === currentUser._id && item.global)) && (
              <button
                className="category-card--link"
                onClick={() => handleRemove(categoryId, item)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  //* Send the chosen card details to the FlippedCard component.
  const handleCardClick = (card) => {
    setChosenCard(card);
    setIsFlippedCard(true);
  };

  //* Close the FlippedCard component.
  const handleClose = () => {
    setIsFlippedCard(false);
  };

  return (
    <div className={`category-container cardImportance-${cardImportance}`}>
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
          role="button"
          className="category--close fas fa-times-circle"
          onClick={handleClose}
        ></i>
      )}
      {isFlippedCard && <FlippedCard card={chosenCard} />}
    </div>
  );
};

export default StudyingCardsToShow;
