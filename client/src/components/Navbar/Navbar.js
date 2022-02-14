import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ currentToken, logout, logoutFromAll }) => {
  //* State:
  const [isJobs, setIsJobs] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [toggle, setToggle] = useState(true);

  //* Use history & location.
  const history = useHistory();
  const location = useLocation();

  // //* Check if the window.innerWidth is less then 1000px for the hamburger menu.
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("window.innerWidth: ", window.innerWidth);
  //     if (window.innerWidth <= 1000) {
  //       setIsMobile(true);
  //     } else {
  //       setIsMobile(false);
  //     }
  //   }, 2000);
  // }, [isMobile]);

  //* Check if the current page is jobs or studying.
  useEffect(() => {
    if (location.pathname === "/job") {
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

  //* Logout user & remove his token from local storage.
  const handleLogout = async () => {
    try {
      await logoutFromAll();
      history.push(`/`);
    } catch (error) {
      console.log("navbar - error", error);
    }
  };

  //* Open & close the hamburger menu as needed.
  const handleHamburgerMenu = () => {
    setToggle(!toggle);
  }

  return (
    <nav className="navbar">
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
      {!isMobile && (
        <div className="navbar--right-side">
          {isStudying && (
            <Link className="navbar--link" to="/studying/quiz">
              Quiz
            </Link>
          )}
          {/* {isStudying && (
            <Link className="navbar--link" to="/studying/globalCategories">
              Get Global Cards
            </Link>
          )} */}
          {isJobs && (
            <Link className="navbar--link" to="/job/new_card">
              New Card
            </Link>
          )}
          {isStudying && (
            <Link className="navbar--link" to="/studying/new_card">
              New Card
            </Link>
          )}
          {currentToken && (
            <Link className="navbar--link" to="/job">
              Jobs
            </Link>
          )}
          {currentToken && (
            <Link className="navbar--link" to="/studying">
              Studying
            </Link>
          )}
          {currentToken && (
            <button className="navbar--btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      )}
      {isMobile && (
        <div className="navbar--right-side">
          {toggle && <button className="navbar--hamburger-btn-open" onClick={handleHamburgerMenu}></button>}
          {/* {!toggle && <button className="navbar--hamburger-btn-close" onClick={handleHamburgerMenu}></button>} */}
          {!toggle && (
            <div className="navbar--hamburger-container">
              <button className="navbar--hamburger-btn-close" onClick={handleHamburgerMenu}></button>
              <div className="navbar--hamburger">
              {isStudying && (
                <Link className="navbar--link" to="/studying/quiz">
                  Quiz
                </Link>
              )}
              {/* {isStudying && (
                <Link className="navbar--link" to="/studying/globalCategories">
                  Get Global Cards
                </Link>
              )} */}
              {isJobs && (
                <Link className="navbar--link" to="/job/new_card">
                  New Card
                </Link>
              )}
              {isStudying && (
                <Link className="navbar--link" to="/studying/new_card">
                  New Card
                </Link>
              )}
              {currentToken && (
                <Link className="navbar--link" to="/job">
                  Jobs
                </Link>
              )}
              {currentToken && (
                <Link className="navbar--link" to="/studying">
                  Studying
                </Link>
              )}
              {currentToken && (
                <button className="navbar--btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
