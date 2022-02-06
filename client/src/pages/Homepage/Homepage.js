import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import Signup from "../../components/Signup/Signup";
import Login from "../../components/Login/Login";
// import TextBox from "../../util/TextBox/TextBox";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import "./Homepage.css";

const Homepage = () => {
  const { show, currentUser, currentToken } = useAuth();
  // const  [show, setShow] = useState(userLoggedIn);
  const [toggle, setToggle] = useState(true);


  const handleToggle = () => {
    setToggle(!toggle);
  };

  // useEffect(() => {
  //   console.log("userLoggedIn: ", userLoggedIn);
  //   setShow(userLoggedIn);
  // }, [userLoggedIn]);

  return (
    <AuthProvider>
      <div className="homepage-container">
        {!currentUser && toggle && <Signup handleClick={handleToggle} />}
        {!currentUser && !toggle && <Login handleClick={handleToggle} />}
        {currentUser && (
          <div className="homepage-container--loggedin">
            User is logged in!
          </div>
        )}
        {/* {show && (
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
        )} */}
      </div>
    </AuthProvider>
  );
};

export default Homepage;
