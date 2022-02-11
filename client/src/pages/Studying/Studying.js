import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Studying.css";
import StudyingCardsToShow from "../../components/StudyingCardsToShow/StudyingCardsToShow";
// import { useAuth } from "../../context/AuthContext";

const Studying = ({ userStudyingArr, currentUser, setStudyingCardId, setStudyingCategoryId, setIsGlobalCard, setChosenStudyingCard }) => {
  const [isEmpty, setIsEmpty] = useState(false);
  // const { userStudyingArr } = useAuth();

  useEffect(() => {
    if (userStudyingArr.length) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [userStudyingArr]);

  const displayCategories = () => {
    return userStudyingArr.map((item) => {
      // console.log("item: ", item);
      const categoryNameArr = item.categoryName.split("-");
      const categoryNameStr = `${categoryNameArr[0].toUpperCase()}-${categoryNameArr[1].toLowerCase()}`
      // console.log("categoryNameStr: ", categoryNameStr);
      return (
        <StudyingCardsToShow
          key={item._id}
          categoryName={categoryNameStr}
          categoryData={item.questionsArr}
          currentUser={currentUser}
          // setStudyingCardId={setStudyingCardId}
          setStudyingCategoryId={setStudyingCategoryId}
          categoryId={item._id}
          // setIsGlobalCard={setIsGlobalCard}
          setChosenStudyingCard={setChosenStudyingCard}
        />
      );
    });
  };

  return (
    <div className="studying">
      {isEmpty && (
        <div className={`msg-container`}>
          <h1>Let's get started!</h1>
          <h3>
            Press
            <Link className="studying--link" to="/studying/new_card">
              here
            </Link>
            to create your own card
          </h3>
        </div>
      )}
      {!isEmpty && displayCategories()}
    </div>
  );
};

export default Studying;
