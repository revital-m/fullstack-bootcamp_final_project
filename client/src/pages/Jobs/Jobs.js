import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Jobs.css";
import JobCardsToShow from "../../components/JobCardsToShow/JobCardsToShow";
import MsgBox from "../../components/MsgBox/MsgBox";
import Spinner from "../../components/Spinner/Spinner";

let slidesArr = [];

const initialState = {
  slideIndex: 0,
};

const slidesReducer = (state, event) => {
  if (event.type === "NEXT") {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % slidesArr.length,
    };
  }
  if (event.type === "PREV") {
    return {
      ...state,
      slideIndex:
        state.slideIndex === 0 ? slidesArr.length - 1 : state.slideIndex - 1,
    };
  }
};

const Jobs = ({ userJobsArr, setUserJobsArr, deleteJobCard }) => {
  //* State:
  const [state, dispatch] = React.useReducer(slidesReducer, initialState);
  const [isEmpty, setIsEmpty] = useState(false);
  const [cardId, setCardId] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isShow, setIsShow] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");
  const [isClose, setIsClose] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  slidesArr = userJobsArr;

  //* Check if the userJobsArr is empty or not.
  useEffect(() => {
    if (!userJobsArr.length) {
      setIsEmpty(true);
      setIsShow(false);
    } else {
      setIsEmpty(false);
      setIsShow(true);
    }
  }, [userJobsArr]);

  //* Send the props needed to MsgBox.
  const handleDelete = (jobCardID) => {
    setCardId(jobCardID);

    const data = userJobsArr.filter((job) => job.jobCardID !== jobCardID);
    setFilteredData(data);

    setMsgClass("");
    setMessage(`Are you sure you want to delete this card?`);
    setPathBack("");
    setIsDelete(true);
    setIsLoading(false);
    setIsShow(false);
    setIsMsgBox(true);
  };

  //* Call deleteJobCard() to delete the card from the Jobs collection.
  const onDelete = async (cardId) => {
    setIsLoading(true);
    setIsShow(false);
    setIsMsgBox(false);
    const res = await deleteJobCard(cardId);
    if (res === 200 || res === 201) {
      setMessage("The card was deleted successfully!");
      setMsgClass("msg--success");
      setUserJobsArr(filteredData);
    } else {
      setMessage(`Something went wrong - ${res}`);
      setMsgClass("msg--error");
    }
    setIsLoading(false);
    setIsClose(true);
    setIsDelete(false);
    setIsEmpty(false);
    setIsMsgBox(true);
    setIsShow(false);
  };

  //* Reset all of the props for the MsgBox component.
  const onGoBack = () => {
    setIsLoading(false);
    setIsMsgBox(false);
    setIsClose(false);
    setIsDelete(false);
    setCardId("");
    setMsgClass("");
    setMessage("");
    setPathBack("");
    if (!filteredData.length) {
      setIsEmpty(true);
    }
    setIsShow(true);
  };

  return (
    <div className="jobs">
      {isEmpty && (
        <div className={`msg-container msg--empty`}>
          <h1>Let's get started!</h1>
          <h3>
            Press
            <Link className="jobs--link" to="/job/new_card">
              here
            </Link>
            to create your first card
          </h3>
        </div>
      )}

      {isLoading && (
        <Spinner spinnerClass="spinner--jobs" loadingClass="loading--jobs" />
      )}
      {isMsgBox && (
        <MsgBox
          msgClass={msgClass}
          message={message}
          pathBack={pathBack}
          handleDelete={() => onDelete(cardId)}
          handleGoBackbtn={onGoBack}
          isDelete={isDelete}
          isClose={isClose}
          notDelete={false}
        />
      )}
      <div className="slides">
        {isShow &&
          [...userJobsArr, ...userJobsArr, ...userJobsArr].map((job, i) => {
            let offset = userJobsArr.length + (state.slideIndex - i);
            return (
              <JobCardsToShow
                offset={offset}
                key={job._id + i}
                jobDescription={job.jobDescription}
                companyName={job.companyName}
                contactEmail={
                  job.contacts && job.contacts.email ? job.contacts.email : ""
                }
                contactFullName={
                  job.contacts && job.contacts.fullName
                    ? job.contacts.fullName
                    : ""
                }
                contactPhone={
                  job.contacts && job.contacts.phone ? job.contacts.phone : ""
                }
                jobCardID={job._id}
                moreInfo={job.moreInfo}
                handleDeleteBtn={() => handleDelete(job._id)}
                owner={job.owner}
                sendCV={job.timeline.sendCV}
                gotCallback={job.timeline.gotCallback}
                negotiation={job.timeline.negotiation}
                interview={job.timeline.interview}
              />
            );
          })}
        {isShow && (
          <button
            className="prev-btn"
            onClick={() => dispatch({ type: "PREV" })}
          >
            ‹{console.log("isShow: ", isShow)}
          </button>
        )}
        {isShow && (
          <button
            className="next-btn"
            onClick={() => dispatch({ type: "NEXT" })}
          >
            ›{console.log("isShow: ", isShow)}
          </button>
        )}
      </div>
    </div>
  );
};

export default Jobs;
