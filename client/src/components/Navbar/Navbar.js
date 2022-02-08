import React, { useState, useEffect,useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
// import { AuthProvider, useAuth,AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = ({currentToken, logout, logoutFromAll}) => {
  // const { logout, currentToken, show, setCurrentToken, currentUser } = useContext(AuthContext);
  
  // const  [isShow, setIsShow] = useState(currentToken);

  const history = useHistory();
  const location = useLocation();

  const [isJobs, setIsJobs] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [userValue, setUserValue] = useState("");

  // useEffect(() => {
  //   const userLoggedIn = currentToken ? true : false;
  //   console.log("In useEffect - userLoggedIn: ", userLoggedIn);
  //   setIsShow(userLoggedIn);
  // }, [show, currentToken, setCurrentToken]);
  

  useEffect(() => {
    if (location.pathname === "/jobs") {
      setIsJobs(true);
      setIsStudying(false);
    } else if (location.pathname === "/studying") {
      setIsJobs(false);
      setIsStudying(true);
    } else {
      setIsJobs(false);
      setIsStudying(false);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      history.push(`/`);
    } catch (error) {
      // history.push(`/error/error/${error.message}`);
    }
  };

  // const handleChange = (e) => {
  //   setUserValue(e.target.value);
  // };

  // console.log("userLoggedIn: ", userLoggedIn);
  // console.log("show: ", show);

  return (

    <nav className="navbar">
      {/* {console.log("currentToken: ", currentToken)} */}
      <div className="navbar--left-side">
        <Link className="navbar--link" to="/">
          Homepage
        </Link>
        {/* {(isJobs || isStudying) && (
          <input
          className="navbar--serch"
          onChange={handleChange}
          type="text"
          placeholder="Search"
          value={userValue}
        ></input>
        )} */}
      </div>
      <div className="navbar--right-side">
        {/* {isStudying && (
          <button className="navbar--btn">Get Global Cards</button>
        )} */}
        {isJobs && (
          <Link className="navbar--link" to="/jobs/new_card">
            New Card
          </Link>
        )}
        {/* {isStudying && (
          <Link className="navbar--link" to="/studying/new_card">
            New Card
          </Link>
        )} */}
        {/* {currentUser && (
          <Link className="navbar--link" to="/jobs">
            Jobs
          </Link>
        )} */}
        {/* {currentUser && (
          <Link className="navbar--link" to="/studying">
            Studying
          </Link>
        )} */}
        {currentToken && (
          <button className="navbar--btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
