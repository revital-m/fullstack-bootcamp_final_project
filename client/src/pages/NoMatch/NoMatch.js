import React from "react";
import { Link } from "react-router-dom";
import "./NoMatch.css";

const NoMatch = () => {
  return (
    <div className="no-match">
        <div  className="no-match-container">
            <h1>404 - Page Not Found</h1>
            <Link to="/" className="no-match--link">
                Back to Homepage
            </Link>
      </div>
    </div>
  );
};

export default NoMatch;
