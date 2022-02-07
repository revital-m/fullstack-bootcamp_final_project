import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Signup from "../../components/Signup/Signup";
import Login from "../../components/Login/Login";
import TextBox from "../../components/TextBox/TextBox";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import "./Homepage.css";

const Homepage = ({ currentToken, signup, login, error, setError }) => {
  // const { show, currentUser, currentToken } = useAuth();
  const [toggle, setToggle] = useState(true);

  const handleToggle = () => {
    setToggle(!toggle);
  }; 

  return (
    <AuthProvider>
      <div className="homepage-container">
        {!currentToken && toggle && <Signup handleClick={handleToggle} signup={signup} error={error} setError={setError} />}
        {!currentToken && !toggle && <Login handleClick={handleToggle} login={login} error={error} setError={setError} />}
        {currentToken && (
          <div className="homepage-container--loggedin">
            <Link to="/jobs" className="homepage--link">
              <TextBox textBoxClass="box--job" textBoxTxt="My Job Search" />
            </Link>
            {/* <Link to="/studying" className="homepage--link">
              <TextBox
                textBoxClass="box--studying"
                textBoxTxt="Studying For My Interview"
              />
            </Link> */}
          </div>
        )}
      </div>
    </AuthProvider>
  );
};

export default Homepage;
