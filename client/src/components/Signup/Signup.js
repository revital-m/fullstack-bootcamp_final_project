import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Signup.css";
import validator from "validator";

function Signup({ handleClick }) {
  //* Terms for a strong password.
  const strongPassword =
    "Password must contain at least: 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol.";

  //* State:
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [err, setErr] = useState("");
  const [isStrongPassword, setIsStrongPassword] = useState(strongPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  //* Ref
  const userNameRef = useRef();

  //* useAuth functions.
  const { signup, error, setError } = useAuth();

  //* Check if the password & the passwordConfirm are the same. and call signup() to signup the user.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setErr("");
      setError("");
      if (password !== passwordConfirm) {
        setIsLoading(false);
        throw new Error("Passwords do not match");
      }
      await signup(password, email, userName);
    } catch (error) {
      console.log(error);
      setCurrent(0);
      setErr(error.message);
    }
    setIsLoading(false);
  };

  //* Controlled Inputs.
  const handleInputChange = (e) => {
    setErr("");
    setError("");
    switch (e.target.name) {
      case "userName":
        setUserName(e.target.value);
        break;
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      case "passwordConfirm":
        setPasswordConfirm(e.target.value);
        break;
      default:
        break;
    }
  };

  //* Check if the password is strong.
  useEffect(() => {
    if (password.length >= 8) {
      if (validator.isStrongPassword(password)) {
        setIsStrongPassword("");
      } else {
        setIsStrongPassword(strongPassword);
      }
    }
  }, [password]);

  //* Focus on the first input.
  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  //* handel the focus on user's changes.
  const handleEnter = (e) => {
    console.log(e);
    const form = e.target.form;
    const index = [...form].indexOf(e.target);
    if (e.type === "click") {
      form.elements[index].focus();
      setCurrent(index);
    } else if (e.key.toLowerCase() === "enter") {
      e.preventDefault();
      form.elements[index + 1].focus();
      setCurrent(index + 1);
    } else {
      form.elements[index].focus();
      setCurrent(index);
    }
  };

  return (
    <div className="signup">
      <div className="signup__card">
        <h2 className="signup__card--title">Sign Up:</h2>
        {err && <h3 className="signup__card--err">{err}</h3>}
        {error && <h3 className="signup__card--err">{error}</h3>}
        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__form--item">
            <label className="signup__form--label">User Name:</label>
            <input
              className={`signup__form--info ${
                current === 0 ? "signup__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="text"
              name="userName"
              ref={userNameRef}
              value={userName}
            ></input>
          </div>
          <div className="signup__form--item">
            <label className="signup__form--label">Email:</label>
            <input
              className={`signup__form--info ${
                current === 1 ? "signup__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="email"
              name="email"
              value={email}
            ></input>
          </div>
          <div className="signup__form--item">
            <label className="signup__form--label">Password:</label>
            <input
              className={`signup__form--info ${
                current === 2 ? "signup__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="password"
              name="password"
              value={password}
            ></input>
            {isStrongPassword && (
              <p className="signup__card--strongPassword">{isStrongPassword}</p>
            )}
          </div>
          <div className="signup__form--item">
            <label className="signup__form--label">
              password Confirmation:
            </label>
            <input
              className={`signup__form--info ${
                current === 3 ? "signup__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="password"
              name="passwordConfirm"
              value={passwordConfirm}
            ></input>
          </div>
          <button
            className={`signup__form--submit-btn ${
              current === 4 ? "signup__form--current" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            Sign Up
          </button>
        </form>
      </div>
      <p className="signup--bottom-txt">
        Already have an account?{" "}
        <button className="homepage--btn" onClick={handleClick}>
          Log In
        </button>
      </p>
    </div>
  );
}

export default Signup;
