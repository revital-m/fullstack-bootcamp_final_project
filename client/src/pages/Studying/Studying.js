import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Studying.css";
import StudyingCardsToShow from "../../components/StudyingCardsToShow/StudyingCardsToShow";
import MsgBox from "../../components/MsgBox/MsgBox";
import Spinner from "../../components/Spinner/Spinner";

const Studying = ({
  userStudyingArr,
  currentUser,
  setStudyingCategoryId,
  setChosenStudyingCard,
  removeQuestionCard,
  deleteQuestionCard,
}) => {
  //* State:
  const [isEmpty, setIsEmpty] = useState(false);
  const [isShow, setIsShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");
  const [isClose, setIsClose] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isRemove, setIsRemove] = useState(false);

  //* Check if the user has any categories.
  useEffect(() => {
    if (userStudyingArr.length) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [userStudyingArr]);

  //* Call deleteJobCard() to delete the card from the Jobs collection.
  const onDelete = async () => {
    setIsLoading(true);
    setIsShow(false);
    setIsMsgBox(false);
    let response = "";
    if (isRemove) {
      response = await removeQuestionCard();
    } else {
      response = await deleteQuestionCard();
    }
    checkAxiosResponse(response);
  };

  //* Check the response from the axios request.
  const checkAxiosResponse = (response) => {
    if (response === 200 || response === 201) {
      setMessage("The card was deleted successfully!");
      setMsgClass("msg--success");
    } else {
      setMessage(`Something went wrong - ${response}`);
      setMsgClass("msg--error");
    }
    setIsLoading(false);
    setIsClose(true);
    setIsDelete(false);
    setIsEmpty(false);
    setIsMsgBox(true);
  };

  //* Reset all of the props for the MsgBox component.
  const onGoBack = () => {
    setIsLoading(false);
    setIsMsgBox(false);
    setIsClose(false);
    setIsDelete(false);
    setMsgClass("");
    setMessage("");
    setPathBack("");
    setIsShow(true);
  };

  //* Display the categories.
  const displayCategories = () => {
    return userStudyingArr.map((item) => {
      const categoryNameArr = item.categoryName.split("-");
      const categoryNameStr = `${categoryNameArr[0].toUpperCase()}-${categoryNameArr[1].toLowerCase()}`;
      const userCard = currentUser.studying.find(
        (card) => card.categoryID === item._id
      );
      return (
        <StudyingCardsToShow
          key={item._id}
          categoryName={categoryNameStr}
          categoryData={item.questionsArr}
          currentUser={currentUser}
          setStudyingCategoryId={setStudyingCategoryId}
          categoryId={item._id}
          setChosenStudyingCard={setChosenStudyingCard}
          setMsgClass={setMsgClass}
          setMessage={setMessage}
          setPathBack={setPathBack}
          setIsDelete={setIsDelete}
          setIsLoading={setIsLoading}
          setIsShow={setIsShow}
          setIsMsgBox={setIsMsgBox}
          setIsRemove={setIsRemove}
          cardImportance={userCard.importance}
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
          handleDelete={() => onDelete()}
          handleGoBackbtn={onGoBack}
          isDelete={isDelete}
          isClose={isClose}
          notDelete={false}
        />
      )}
      {isShow && displayCategories()}
    </div>
  );
};

export default Studying;
