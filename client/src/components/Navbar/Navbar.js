import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const [isJobs, setIsJobs] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  // const [userValue, setUserValue] = useState("");

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
      history.push(`/error/error/${error.message}`);
    }
  };

  // const handleChange = (e) => {
  //   setUserValue(e.target.value);
  // };

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
      <div className="navbar--right-side">
        {/* {isStudying && (
          <button className="navbar--btn">Get Global Cards</button>
        )} */}
        {isJobs && (
          <Link className="navbar--link" to="/jobs/new_card">
            New Card
          </Link>
        )}
        {isStudying && (
          <Link className="navbar--link" to="/studying/new_card">
            New Card
          </Link>
        )}
        {currentUser && (
          <Link className="navbar--link" to="/jobs">
            Jobs
          </Link>
        )}
        {currentUser && (
          <Link className="navbar--link" to="/studying">
            Studying
          </Link>
        )}
        {currentUser && (
          <button className="navbar--btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
