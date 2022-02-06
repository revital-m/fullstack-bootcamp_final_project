import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Jobs.css";
import JobCardsToShow from "../../components/JobCardsToShow/JobCardsToShow";
import { useAuth } from "../../context/AuthContext";
import MsgBox from "../../components/MsgBox/MsgBox";
import Spinner from "../../components/Spinner/Spinner";
// import { deleteCard } from "../../api/crud";

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

const Jobs = () => {
  const [state, dispatch] = React.useReducer(slidesReducer, initialState);
  const [isEmpty, setIsEmpty] = useState(false);
  // const { userJobsArr, userJobsID, editJobArr } = useAuth();
  const userJobsArr = [];

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

  useEffect(() => {
    if (!userJobsArr.length) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
  }, [userJobsArr]);

  const handleDelete = (id, jobCardID) => {
    setCardId(id);

    const data = userJobsArr.filter(job => job.jobCardID !== jobCardID);
    // console.log(data);
    setFilteredData(data);

    setMsgClass("");
    setMessage(`Are you sure you want to delete this card?`);
    setPathBack("");
    setIsDelete(true);
    setIsLoading(false);
    setIsShow(false);
    setIsMsgBox(true);
  }

  // const onDelete = async () => {
  //   setIsLoading(true);
  //   setIsShow(false);
  //   setIsMsgBox(false);
  //   const res = await deleteCard("jobs", userJobsID, cardId);
  //   if (res === 200 || res === 201) {
  //     setMessage("The card was deleted successfully!");
  //     setMsgClass("msg--success");
  //     editJobArr(filteredData);
  //   } else {
  //     setMessage(`Something went wrong - ${res}`);
  //     setMsgClass("msg--error");
  //   }
  //   setIsLoading(false);
  //   setIsClose(true);
  //   setIsDelete(false);
  //   setIsEmpty(false);
  //   setIsMsgBox(true);
  // }

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
  }

  // const displayJobCards = () => {
  //   return userJobsArr.map((job) => {
  //     // console.log(job);
  //     return (
  //       <div key={job.jobCardID}>
  //         <JobCardsToShow
  //           key={job.jobCardID}
  //           jobDescription={job.jobDescription}
  //           companyName={job.companyName}
  //           contactEmail={job.contacts.email}
  //           contactFullName={job.contacts.fullName}
  //           contactPhone={job.contacts.phone}
  //           jobCardID={job.jobCardID}
  //           moreInfo={job.moreInfo}
  //           handleDeletebtn={handleDelete}
  //           id={job.id}
  //         />
  //       </div>
  //     );
  //   });
  // };

  return (
    <div className="jobs">
      {isEmpty && (
        <div className={`msg-container msg--empty`}>
          <h1>Let's get started!</h1>
          <h3>
            Press
            <Link className="jobs--link" to="/jobs/new_card">
              here
            </Link>
            to create your first card
          </h3>
        </div>
      )}

      {isLoading && <Spinner />}
      {isMsgBox && <MsgBox msgClass={msgClass} message={message} pathBack={pathBack} handleDelete="" handleGoBackbtn={onGoBack} isDelete={isDelete} isClose={isClose} notDelete={false} />}
      {isShow &&     <div className="slides">
      {[...userJobsArr, ...userJobsArr, ...userJobsArr].map((job, i) => {
        let offset = userJobsArr.length + (state.slideIndex - i);
        return <JobCardsToShow offset={offset} key={job.jobCardID+i}
        jobDescription={job.jobDescription}
        companyName={job.companyName}
        contactEmail={job.contacts.email}
        contactFullName={job.contacts.fullName}
        contactPhone={job.contacts.phone}
        jobCardID={job.jobCardID}
        moreInfo={job.moreInfo}
        handleDeletebtn={handleDelete}
        id={job.id} />;
      })}
      <button className="prev-btn" onClick={() => dispatch({ type: "PREV" })}>‹</button>
      <button className="next-btn" onClick={() => dispatch({ type: "NEXT" })}>›</button>
    </div>}
      {/* {isShow && <div className="jobs-card-container">{displayJobCards()}</div>} */}
    </div>
  );
};

export default Jobs;