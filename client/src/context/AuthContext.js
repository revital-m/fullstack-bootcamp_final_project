import React, { useContext, useState, useEffect } from "react";
import myApi from "../api/Api";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("");
  const [currentToken, setCurrentToken] = useState(localStorage.getItem("JobPreparingToken"));

  let userLoggedIn = currentToken ? true : false;

  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  const  [show, setShow] = useState(userLoggedIn);
  const [error, setError] = useState("");



  //* Signup user and add his token to local storage.
  async function signup(password, email, name) {
    setError("");
    let obj = {
      password: password,
      email: email,
      userName: name,
    };
    try {
      const response = await myApi.post("/users/signup", obj);
      setCurrentToken(response.data.token);
      setCurrentUser(response.data.user);
      localStorage.setItem('JobPreparingToken', response.data.token);

    } catch (e) {
      if (e.response.data.message) {
        setError(e.response.data.message.replace("User validation failed:", "Error -"));
      }
      else {
        setError("Unable to signup");
      }
    }
  }

  //* Login user and add his token to local storage.
  async function login(email, password) {
    setError("");
    let obj = {
      email: email,
      password: password,
    };
    try {
      const response = await myApi.post("/users/login", obj);
      console.log("login: ", response);
      setCurrentToken(response.data.token);
      // setCurrentUser(response.data.user);
      localStorage.setItem('JobPreparingToken', response.data.token);

    } catch (e) {
      setError(e.response.data);
    }
  }

  

  //* Logout user & remove his token from local storage
  async function logout() {
    setError("");

    try {
      const response = await myApi.post("/users/logout");
      setCurrentToken("");
      setCurrentUser(null);
      console.log(response);
      localStorage.clear();

    } catch (e) {
      console.log(e);
      // setError(e.response.data.message);
      
    }

  }

  //logout from all user's devices
  async function logoutFromAll(){
    setError("");

    try {
      const response = await myApi.post("/users/logoutAll");

      console.log(response);
      localStorage.clear();

    } catch (e) {

      setError(e.response.data.message);
      
    }
  }

  // console.log(error);


  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setCurrentUser(user);
  //   });
  //   return unsubscribe;
  // }, []);
 

  // useEffect(() => {
  //   console.log("In useEffect - userLoggedIn: ", userLoggedIn);
  //   userLoggedIn = currentToken ? true : false;
  //   // console.log("userLoggedIn: ", userLoggedIn);
  //   setShow(userLoggedIn);
  // }, [currentToken, setCurrentToken]);

  // useEffect(() => {
  //   setCurrentToken(localStorage.getItem("JobPreparingToken"));
  // }, [currentUser]);

  useEffect(() => {

    setError("");

    const handleGetUser = async () => {
      try {
        const response = await myApi.get("/users/myProfile");
        setCurrentUser(response.data);
      } catch (e) {
        setError(e.response.data.message);
      }
    };
  
    handleGetUser();
 
  }, [currentToken, setCurrentToken]);


  // console.log("userLoggedIn: ", userLoggedIn);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    logoutFromAll,
    currentToken,
    setCurrentToken,
    error,
    setError,
    show,
    userLoggedIn,
  };

  return <AuthContext.Provider value={ {currentUser,
    signup,
    login,
    logout,
    logoutFromAll,
    currentToken,
    setCurrentToken,
    error,
    setError,
    show,
    userLoggedIn} }>{children}</AuthContext.Provider>;
}