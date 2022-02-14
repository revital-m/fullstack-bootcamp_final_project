import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import MsgBox from "../MsgBox/MsgBox";
import Spinner from "../Spinner/Spinner";

function JobEditCard({ userJobsArr, saveUpdateJobCard }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(true);

  //* State for the job card:
  const [err, setErr] = useState("");
  const [current, setCurrent] = useState(4);
  const [sendCV, setSendCV] = useState(true);
  const [gotCallback, setGotCallback] = useState(false);
  const [interview, setInterview] = useState(false);
  const [negotiation, setNegotiation] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [infoText, setInfoText] = useState("");

  const [placeholderEmail, setPlaceholderEmail] = useState("temp@gmail.com");
  const [placeholderFullName, setPlaceholderFullName] = useState("Full Name");
  const [placeholderPhone, setPlaceholderPhone] = useState("9999-999-999");

  //* State for the MsgBox component.
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");

  //* Ref & params
  const emailRef = useRef();
  const params = useParams();

  useEffect(() => {
    const cardToUpdate = userJobsArr.filter((job) => job._id === params.id);
    setGotCallback(cardToUpdate[0].timeline.gotCallback);
    setInterview(cardToUpdate[0].timeline.interview);
    setNegotiation(cardToUpdate[0].timeline.negotiation);
    if (cardToUpdate[0].contacts) {
      const emailPlaceholder = cardToUpdate[0].contacts.email
        ? cardToUpdate[0].contacts.email
        : "temp@gmail.com";
      setPlaceholderEmail(emailPlaceholder);
      const namePlaceholder = cardToUpdate[0].contacts.fullName
        ? cardToUpdate[0].contacts.fullName
        : "Full Name";
      setPlaceholderFullName(namePlaceholder);
      const phonePlaceholder = cardToUpdate[0].contacts.phone
        ? cardToUpdate[0].contacts.phone
        : "9999-999-999";
      setPlaceholderPhone(phonePlaceholder);
    }
  }, []);

  //* Call saveUpdateJobCard() to save the card to the Jobs collection.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsShow(false);
    try {
      setErr("");
      const updates = creatUpdatesObj();
      console.log("updates: ", updates);
      const response = await saveUpdateJobCard(params.id, updates);
      if (response === 200 || response === 201) {
        setMsgClass("msg--success");
        setMessage("The card was update successfully!");
      } else {
        setMsgClass("msg--error");
        setMessage(`Something went wrong - ${response.status}`);
      }
      setPathBack("/job");
      setIsLoading(false);
      setIsMsgBox(true);
    } catch (error) {
      setCurrent(4);
      setIsLoading(false);
      setErr(error.message);
      setIsShow(true);
    }
  };

  //* Check if the timeline is valid.
  const validTimeline = () => {
    const timelineArr = [sendCV, gotCallback, interview, negotiation];
    if (negotiation) {
      timelineArr[1] = true;
      timelineArr[2] = true;
    } else if (interview) {
      timelineArr[1] = true;
    }
    return timelineArr;
  };

  //* Create the new card object to be saved.
  const creatUpdatesObj = () => {
    const timelineArr = validTimeline();
    const updatedCard = {
      gotCallback: timelineArr[1],
      interview: timelineArr[2],
      negotiation: timelineArr[3],
    };
    if (email) {
      updatedCard.email = email;
    }
    if (fullName) {
      updatedCard.fullName = fullName;
    }
    if (phone) {
      updatedCard.phone = phone;
    }
    if (infoText) {
      updatedCard.moreInfo = infoText;
    }
    return updatedCard;
  };

  //* Focus on the first input.
  useEffect(() => {
    emailRef.current.focus();
  }, []);

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

  //* Controlled Inputs.
  const handleInputChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;
      case "fullName":
        setFullName(e.target.value);
        break;
      case "phone":
        setPhone(e.target.value);
        break;
      case "infoText":
        setInfoText(e.target.value);
        break;
      case "sendCV":
        setSendCV(sendCV);
        break;
      case "gotCallback":
        setGotCallback(!gotCallback);
        break;
      case "interview":
        setInterview(!interview);
        break;
      case "negotiation":
        setNegotiation(!negotiation);
        break;
      default:
        break;
    }
  };

  return (
    <div className="JobCard">
      {isLoading && (
        <Spinner spinnerClass="spinner--jobs" loadingClass="loading--jobs" />
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
        <form className="JobCard-container" onSubmit={handleSubmit}>
          {err && <p className="job-card--err">{err}</p>}
          <section className="job-card__timeline">
            <div>
              <input
                className="job-card__timeline--check-mark"
                onChange={handleInputChange}
                type="checkbox"
                name="sendCV"
                checked={sendCV}
              ></input>
              <label className="job-card--label">Send CV</label>
            </div>
            <div>
              <input
                className="job-card__timeline--check-mark"
                onChange={handleInputChange}
                type="checkbox"
                name="gotCallback"
                checked={gotCallback}
              ></input>
              <label className="job-card--label">Got Callback</label>
            </div>
            <div>
              <input
                className="job-card__timeline--check-mark"
                onChange={handleInputChange}
                type="checkbox"
                name="interview"
                checked={interview}
              ></input>
              <label className="job-card--label">Got an Interview</label>
            </div>
            <div>
              <input
                className="job-card__timeline--check-mark"
                onChange={handleInputChange}
                type="checkbox"
                name="negotiation"
                checked={negotiation}
              ></input>
              <label className="job-card--label">In Negotiation</label>
            </div>
          </section>
          <section className="job-card__contacts-info">
            <div className="job-card--contacts">
              <label className="job-card--label">Contacts:</label>
              <input
                className={`job-card--info ${
                  current === 4 ? "job-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="email"
                name="email"
                ref={emailRef}
                placeholder={placeholderEmail}
                value={email}
              ></input>
              <input
                className={`job-card--info ${
                  current === 5 ? "job-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="text"
                name="fullName"
                placeholder={placeholderFullName}
                value={fullName}
              ></input>
              <input
                className={`job-card--info ${
                  current === 6 ? "job-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="tel"
                name="phone"
                placeholder={placeholderPhone}
                value={phone}
              ></input>
            </div>
            <div className="job-card--textarea">
              <label className="job-card--label">More Information:</label>
              <textarea
                className={`job-card--info ${
                  current === 7 ? "job-card__form--current" : ""
                }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                name="infoText"
                cols="30"
                rows="8"
                value={infoText}
              ></textarea>
            </div>
          </section>
          <button
            className={`job-card--btn ${
              current === 8 ? "job-card__form--current" : ""
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
}

export default JobEditCard;
