import React from 'react';
import { Link } from "react-router-dom";
import './JobCardsToShow.css';

function JobCardsToShow({ offset, jobDescription, companyName, contactEmail, contactFullName, contactPhone, jobCardID, moreInfo, handleDeleteBtn, owner }) {
    const active = offset === 0 ? true : null;
  
    const displayMoreInfo = () => {
      return moreInfo.map((item) => {
        console.log("item: ", item);
          return (
              <div key={item._id} className="JobCardsToShow__more-info">
                  <div className="JobCardsToShow__more-info--date">{item.createdAt}</div>
                  <div className="JobCardsToShow__more-info--txt">{item.info}</div>
              </div>
          );
      });
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
        <div
          className="slideBackground"
        />
        <div
          className="slideContent JobCardsToShow--container"
        >
          <p className="JobCardsToShow--line"><span className="JobCardsToShow--title">Job Description:</span>{jobDescription}</p>
                  <p className="JobCardsToShow--line"><span className="JobCardsToShow--title">Company:</span>{companyName}</p>
                  <p className="JobCardsToShow--title">Contacts:</p>
                  <ul>
                      <li><i className="JobCardsToShow--icon fas fa-user-circle"></i>{` - ${contactFullName}`}</li>
                      <li><i className="JobCardsToShow--icon fas fa-phone-square-alt"></i>{` - ${contactPhone}`}</li>
                      <li><i className="JobCardsToShow--icon fas fa-envelope"></i>{` - ${contactEmail}`}</li>
                  </ul>
                  <div className="JobCardsToShow__more-info--container">{displayMoreInfo()}</div>
                  <div className="JobCardsToShow__btns">
                      <Link className="JobCardsToShow--link" to={`/jobs/edit_card/${jobCardID}`}>Edit</Link>
                      <button className="JobCardsToShow--link" onClick={() => handleDeleteBtn(owner, jobCardID)}>Delete</button>
                      {/* <Link className="JobCardsToShow--link" to={`/card/delete/${jobCardID}/jobs`}>Delete</Link> */}
                  </div>
        </div>
      </div>
    );
  }

export default JobCardsToShow
