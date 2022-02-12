import React, { useState } from "react";
import { Link } from "react-router-dom";
import Signup from "../../components/Signup/Signup";
import Login from "../../components/Login/Login";
import TextBox from "../../components/TextBox/TextBox";
import Spinner from "../../components/Spinner/Spinner";
import "./Homepage.css";

const Homepage = ({ currentToken, signup, login, error, setError, isLoading }) => {

  //* State:
  const [toggle, setToggle] = useState(true);

  //* Toggle between login and signup.
  const handleToggle = () => {
    setToggle(!toggle);
  }; 

  return (
      <div className={`homepage-container ${currentToken ? "" : "homepage-container-before-user"}`}>
      {isLoading && <Spinner spinnerClass="spinner--homepage" loadingClass="loading--homepage" />}
        {(!currentToken && toggle && !isLoading) && <Signup handleClick={handleToggle} signup={signup} error={error} setError={setError} />}
        {(!currentToken && !toggle && !isLoading) && <Login handleClick={handleToggle} login={login} error={error} setError={setError} />}
        {(currentToken && !isLoading) && (
          <div className="homepage-container--loggedin">
            <Link to="/jobs" className="homepage--link">
              <TextBox textBoxClass="box--job" textBoxTxt="My Job Search" />
            </Link>
            <Link to="/studying" className="homepage--link">
              <TextBox
                textBoxClass="box--studying"
                textBoxTxt="Studying For My Interview"
              />
            </Link>
          </div>
        )}
      </div>
  );
};

export default Homepage;
