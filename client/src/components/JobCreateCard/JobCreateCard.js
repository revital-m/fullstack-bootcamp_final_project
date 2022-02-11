import React, { useState, useRef, useEffect } from "react";
import MsgBox from "../MsgBox/MsgBox";
import Spinner from "../Spinner/Spinner";
import "./JobCreateCard.css";

function JobCreateCard({ saveNewJobCard }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(true);

  //* State for the job card:
  const [err, setErr] = useState("");
  const [current, setCurrent] = useState(4);
  const [sendCV, setSendCV] = useState(true);
  const [gotCallback, setGotCallback] = useState(false);
  const [interview, setInterview] = useState(false);
  const [negotiation, setNegotiation] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isJobDescription, setIsJobDescription] = useState(
    "job-card--label-required"
  );
  const [companyName, setCompanyName] = useState("");
  const [isCompanyName, setIsCompanyName] = useState(
    "job-card--label-required"
  );
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [infoText, setInfoText] = useState("");

  //* State for the MsgBox component.
  const [isMsgBox, setIsMsgBox] = useState(false);
  const [msgClass, setMsgClass] = useState("");
  const [message, setMessage] = useState("");
  const [pathBack, setPathBack] = useState("");

  //* Ref
  const jobDescriptionRef = useRef();

  //* Check if all of the required fields are provided and call saveNewJobCard() to save the card to the Jobs collection.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsShow(false);
    try {
      setErr("");
      if (!jobDescription || !companyName) {
        throw new Error("Required fields are not provided!");
      }
      const newCard = creatNewCardObj();
      const response = await saveNewJobCard(newCard);
      if (response === 200 || response === 201) {
        setMsgClass("msg--success");
        setMessage("The card was create successfully!");
      } else {
        setMsgClass("msg--error");
        setMessage(`Something went wrong - ${response.status}`);
      }
      setPathBack("/jobs");
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
  const creatNewCardObj = () => {
    const timelineArr = validTimeline();
    const newCard = {
      jobDescription: jobDescription,
      companyName: companyName,
      timeline: {
        sendCV: timelineArr[0],
        gotCallback: timelineArr[1],
        interview: timelineArr[2],
        negotiation: timelineArr[3],
      },
    };
    const contact = {};
    if (email) {
      contact.email = email;
    }
    if (fullName) {
      contact.fullName = fullName;
    }
    if (phone) {
      contact.phone = phone;
    }
    if (email || fullName || phone) {
      newCard.contacts = contact;
    }
    if (infoText) {
      newCard.moreInfo = {
        info: infoText,
      };
    }
    return newCard;
  };

  //* Check if the job description is provided.
  useEffect(() => {
    if (jobDescription) {
      setIsJobDescription("");
    } else {
      setIsJobDescription("job-card--label-required");
    }
  }, [jobDescription]);

  //* Check if the company name is provided.
  useEffect(() => {
    if (companyName) {
      setIsCompanyName("");
    } else {
      setIsCompanyName("job-card--label-required");
    }
  }, [companyName]);

  //* Focus on the first input.
  useEffect(() => {
    jobDescriptionRef.current.focus();
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
      case "jobDescription":
        setJobDescription(e.target.value);
        break;
      case "companyName":
        setCompanyName(e.target.value);
        break;
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
        <form className="JobCard-container" onSubmit={handleSubmit}>
          <p className="job-card--required-field">
            All red fields are required.
          </p>
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
          <section className="job-card__description-company">
            <div>
              <label className={`job-card--label ${isJobDescription}`}>
                Job Description:
              </label>
              <input
                className={`job-card--info ${current === 4 ? "job-card__form--current" : ""
                  }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="text"
                name="jobDescription"
                ref={jobDescriptionRef}
                value={jobDescription}
              ></input>
            </div>
            <div>
              <label className={`job-card--label ${isCompanyName}`}>
                Company:
              </label>
              <input
                className={`job-card--info ${current === 5 ? "job-card__form--current" : ""
                  }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="text"
                name="companyName"
                value={companyName}
              ></input>
            </div>
          </section>
          <section className="job-card__contacts-info">
            <div className="job-card--contacts">
              <label className="job-card--label">Contacts:</label>
              <input
                className={`job-card--info ${current === 6 ? "job-card__form--current" : ""
                  }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="email"
                name="email"
                placeholder="temp@gmail.com"
                value={email}
              ></input>
              <input
                className={`job-card--info ${current === 7 ? "job-card__form--current" : ""
                  }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={fullName}
              ></input>
              <input
                className={`job-card--info ${current === 8 ? "job-card__form--current" : ""
                  }`}
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                onClick={handleEnter}
                type="tel"
                name="phone"
                placeholder="999-999-9999"
                value={phone}
              ></input>
            </div>
            <div className="job-card--textarea">
              <label className="job-card--label">More Information:</label>
              <textarea
                className={`job-card--info ${current === 9 ? "job-card__form--current" : ""
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
            className={`job-card--btn ${current === 10 ? "job-card__form--current" : ""
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

export default JobCreateCard;