import React, { useState } from "react";
// import { Link } from "react-router-dom";
import "./StudyingCardsToShow.css";
import FlippedCard from "../FlippedCard/FlippedCard";
import { Link, useHistory, useLocation } from "react-router-dom";

// import { useAuth } from "../../context/AuthContext";

const StudyingCardsToShow = ({ categoryName, categoryData, currentUser, setStudyingCategoryId, categoryId, setChosenStudyingCard }) => {
  const [choosenCard, setChoosenCard] = useState("");
  const [isShow, setIsShow] = useState(false);
  const history = useHistory();

  // const [isUserCard, setIsUserCard] = useState(false);
  // console.log("currentUser: ", currentUser);

  // const { userUID } = useAuth();

  // useEffect(() => {
  //   if (userUID === userUid) {
  //     setIsUserCard(true);
  //   } else {
  //     setIsUserCard(false);
  //   }
  // }, [userUID, userUid]);

  const handleEdit = (chosenCardId, chosenCategoryId, isGlobal, card) => {
    // setStudyingCardId(chosenCardId);
    setStudyingCategoryId(chosenCategoryId);
    // setIsGlobalCard(isGlobal);
    setChosenStudyingCard(card);
    history.push(`/studying/edit_card`);
  }

  const displayQuestions = () => {
    return categoryData.map((item) => {
      // console.log("item: ", item);
      return (
        <div
          key={item._id}
          className="category-card-to-show"
          onClick={() => handleCardClick(item)}
        >
          <div className="category-card--title-container">
            <h3 className="category-card--title">{item.title}</h3>
          </div>
          {/* <p className="category-card--body">{item.question}</p> */}
          <div className="category-card--btns">
            {(item.owner === currentUser._id) && (
              <button className="category-card--link" onClick={() => handleEdit(item._id, categoryId, item.global, item)}>Edit</button>
              // <Link className="category-card--link" to={`/studying/edit_card/${item._id}`} >
              //   Edit
              // </Link>
            )}
            {(item.owner === currentUser._id) && (
              <Link className="category-card--link" to="/">
                Delete
              </Link>
            )}
            {(item.owner !== currentUser._id) && (
              <Link className="category-card--link" to="/" >
                Remove
              </Link>
            )}
          </div>
        </div>
      );
    });
  };

  const handleCardClick = (card) => {
    setChoosenCard(card);
    setIsShow(true);
  };

  const handleClose = () => {
    setIsShow(false);
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
      {isShow && (
        <i
          className="category--close fas fa-times-circle"
          onClick={handleClose}
        ></i>
      )}
      {isShow && <FlippedCard card={choosenCard} />}
    </div>
  );
};

export default StudyingCardsToShow;
