import React from "react";
import { Link } from "react-router-dom";
import "./JobCardsToShow.css";

function JobCardsToShow({
  offset,
  jobDescription,
  companyName,
  contactEmail,
  contactFullName,
  contactPhone,
  jobCardID,
  moreInfo,
  handleDeleteBtn,
  owner,
  sendCV,
  gotCallback,
  interview,
  negotiation,
}) {
  const active = offset === 0 ? true : null;

  const displayMoreInfo = () => {
    return moreInfo.map((item) => {
      return (
        <div key={item._id} className="JobCardsToShow__more-info">
          <div className="JobCardsToShow__more-info--date">
            {item.createdAt}
          </div>
          <div className="JobCardsToShow__more-info--txt">{item.info}</div>
        </div>
      );
    });
  };

  const phone = contactPhone
    ? `${contactPhone.substring(0, 3)}-${contactPhone.substring(
        3,
        6
      )}-${contactPhone.substring(6)}`
    : contactPhone;

  let currentTimeline = "";
  if (negotiation) {
    currentTimeline = "timeline__innerLine--negotiation";
  } else if (interview) {
    currentTimeline = "timeline__innerLine--interview";
  } else if (gotCallback) {
    currentTimeline = "timeline__innerLine--gotCallback";
  }

  return (
    <div
      className="slide"
      data-active={active}
      style={{
        "--offset": offset,
        "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1,
      }}
    >
      <div className="slideBackground" />
      <div className="slideContent JobCardsToShow--container">
        <section className="timeline">
          <div className="timeline--line">
            <span className={`timeline__innerLine ${currentTimeline}`}></span>
          </div>
          <ul className="timeline__list">
            <li className="timeline__list--item">
              <span
                className={`timeline--point ${
                  sendCV ? "timeline--point--done" : ""
                }`}
              ></span>
              <span className="timeline--type">Send CV</span>
            </li>
            <li className="timeline__list--item">
              <span
                className={`timeline--point ${
                  gotCallback ? "timeline--point--done" : ""
                }`}
              ></span>
              <span className="timeline--type timeline--type--underline">
                Got Callback
              </span>
            </li>
            <li className="timeline__list--item">
              <span
                className={`timeline--point ${
                  interview ? "timeline--point--done" : ""
                }`}
              ></span>
              <span className="timeline--type">Got Interview</span>
            </li>
            <li className="timeline__list--item">
              <span
                className={`timeline--point ${
                  negotiation ? "timeline--point--done" : ""
                }`}
              ></span>
              <span className="timeline--type timeline--type--underline">
                Negotiation
              </span>
            </li>
          </ul>
        </section>
        <p className="JobCardsToShow--line">
          <span className="JobCardsToShow--title">Job Description:</span>
          {jobDescription}
        </p>
        <p className="JobCardsToShow--line">
          <span className="JobCardsToShow--title">Company:</span>
          {companyName}
        </p>
        <p className="JobCardsToShow--title">Contacts:</p>
        <ul>
          <li>
            <i className="JobCardsToShow--icon fas fa-user-circle"></i>
            {`  ${contactFullName}`}
          </li>
          <li>
            <i className="JobCardsToShow--icon fas fa-phone-square-alt"></i>
            {`  ${phone}`}
          </li>
          <li>
            <i className="JobCardsToShow--icon fas fa-envelope"></i>
            {`  ${contactEmail}`}
          </li>
        </ul>
        <div className="JobCardsToShow__more-info--container">
          {displayMoreInfo()}
        </div>
        <div className="JobCardsToShow__btns">
          <Link
            className="JobCardsToShow--link"
            to={`/jobs/edit_card/${jobCardID}`}
          >
            Edit
          </Link>
          <button
            className="JobCardsToShow--link"
            onClick={() => handleDeleteBtn(owner, jobCardID)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCardsToShow;
