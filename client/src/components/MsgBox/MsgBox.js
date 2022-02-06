import React from "react";
import { Link } from "react-router-dom";

import "./MsgBox.css";

const MsgBox = ({
  msgClass,
  message,
  pathBack,
  handleDelete,
  handleGoBackbtn,
  isDelete,
  isClose,
  notDelete,
}) => {
  return (
    <div className={`msg-container ${msgClass}`}>
      <h1>{message}</h1>
      {notDelete && (
        <div className="msg--btn-container">
          <Link className="msg--link" to={pathBack}>
            Go Back
          </Link>
        </div>
      )}
      {isDelete && (
        <div className="msg--btn-container">
          <button className="msg--btn" onClick={handleGoBackbtn}>
            Go Back
          </button>
          <button className="msg--btn" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
      {isClose && (
        <div className="msg--btn-container">
          <button className="msg--btn" onClick={handleGoBackbtn}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default MsgBox;
