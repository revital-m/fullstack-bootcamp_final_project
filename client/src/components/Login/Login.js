import React, { useState, useRef, useEffect } from "react";

function Login({ handleClick, login, error, setError }) {
  //* State:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  //* Ref
  const emailRef = useRef();

  //* Call login() to login the user.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      setError("");
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      setCurrent(0);
      setErr("Failed to log in");
    }
  };

  //* Controlled Inputs.
  const handleInputChange = (e) => {
    setErr("");
    setError("");
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  //* Focus on the first input.
  useEffect(() => {
    emailRef.current.focus();
  }, []);

  //* handel the focus on user's changes.
  const handleEnter = (e) => {
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
        <h2 className="signup__card--title">Log In:</h2>
        {err && <h3 className="signup__card--err">{err}</h3>}
        {error && <h3 className="signup__card--err">{error}</h3>}
        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__form--item">
            <label className="signup__form--label">Email:</label>
            <input
              className={`signup__form--info ${
                current === 0 ? "signup__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="email"
              name="email"
              ref={emailRef}
              value={email}
            ></input>
          </div>
          <div className="signup__form--item">
            <label className="signup__form--label">Password:</label>
            <input
              className={`signup__form--info ${
                current === 1 ? "signup__form--current" : ""
              }`}
              onChange={handleInputChange}
              onKeyDown={handleEnter}
              onClick={handleEnter}
              type="password"
              name="password"
              value={password}
            ></input>
          </div>
          <button
            className={`signup__form--submit-btn ${
              current === 2 ? "signup__form--current" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            Log In
          </button>
        </form>
      </div>
      <p className="signup--bottom-txt">
        Need an account?{" "}
        <button className="homepage--btn" onClick={handleClick}>
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
