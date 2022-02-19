import React, { useState, useEffect } from "react";
import "./StudyingGlobalCategories.css";
import MsgBox from "../MsgBox/MsgBox";
import Spinner from "../Spinner/Spinner";

const StudyingGlobalCategories = ({ getGlobalCards, categoriesName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(true);

  //* State for the studying card:
  const [err, setErr] = useState("");
  const [categoriesArray, setCategoriesArray] = useState([]);

  //* State for the MsgBox component.
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");

  //* Create the categories array.
  useEffect(() => {
    const globalCategories = categoriesName.map((category) => {
      const categoryNameArr = category.categoryName.split("-");
      const categoryNameStr = `${categoryNameArr[0].toUpperCase()}-${categoryNameArr[1].toLowerCase()}`;
      return {
        categoryName: categoryNameStr,
        categoryID: category.categoryID,
        value: false,
      };
    });
    setCategoriesArray(globalCategories);
  }, []);

  //* Check if all of the required fields are provided and call saveNewStudyingCard() to save the card to the Studying collection.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsShow(false);
    setErr("");
    try {
      const categoriesObj = createCategoriesArr();
      // console.log("categoriesObj: ", categoriesObj);
      const response = await getGlobalCards(categoriesObj);
      checkAxiosResponse(response);
    } catch (error) {
      console.table(error);
      setIsLoading(false);
      setErr(error.message);
      setIsShow(true);
    }
  };

  //* Create the new question to send to the server.
  const createCategoriesArr = () => {
    const categoriesToGet = [];
    categoriesArray.forEach((category) => {
      if (category.value) {
        categoriesToGet.push(category.categoryID);
      }
    });
    const categoriesToGetObj = {
      categoriesArr: categoriesToGet,
    };
    return categoriesToGetObj;
  };

  //* Check the response from the axios request.
  const checkAxiosResponse = (response) => {
    if (response === 200 || response === 201) {
      setMsgClass("msg--success");
      setMessage("The card was create successfully!");
    } else {
      console.table(response);
      setMsgClass("msg--error");
      setMessage(`Something went wrong - ${response.response.data}`);
    }
    setPathBack("/studying");
    setIsLoading(false);
    setIsMsgBox(true);
  };

  //* Display the categories checkbox.
  const displayCategories = () => {
    return categoriesArray.map((category) => {
      return (
        <div className="studying-card__check-mark" key={category.categoryID}>
          <input
            className="job-card__timeline--check-mark"
            onChange={handleInputChange}
            type="checkbox"
            name={category.categoryName}
            checked={category.value}
          ></input>
          <label className="studying-card--label">
            {category.categoryName}
          </label>
        </div>
      );
    });
  };

  //* Controlled Inputs.
  const handleInputChange = (e) => {
    const controlledArr = categoriesArray.map((category) => {
      if (e.target.name === category.categoryName) {
        category.value = !category.value;
      }
      return category;
    });
    setCategoriesArray(controlledArr);
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
            {displayCategories()}
          </section>
          <button
            className="studying-card--btn"
            type="submit"
            disabled={isLoading}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default StudyingGlobalCategories;
