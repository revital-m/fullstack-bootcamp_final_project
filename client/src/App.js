import React, { useEffect, useState } from "react";
import { Switch, BrowserRouter, Route, Link } from "react-router-dom";
import "./App.css";
// import myApi from './api/Api';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import Jobs from "./pages/Jobs/Jobs";
// import JobCard from "./components/JobCard/JobCard";
import JobCreateCard from "./components/JobCreateCard/JobCreateCard";
import JobEditCard from "./components/JobEditCard/JobEditCard";
// import Studying from "./pages/Studying/Studying";
// import StudyingCard from "./components/StudyingCard/StudyingCard";
import NoMatch from "./pages/NoMatch/NoMatch";
// import Message from "./components/Message/Message";
// import { AuthProvider } from "./context/AuthContext";
// import Signup from "./components/Signup/Signup";
import myApi from "./api/Api";

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [currentToken, setCurrentToken] = useState(localStorage.getItem("JobPreparingToken"));
  const [error, setError] = useState("");

  const [userJobsArr, setUserJobsArr] = useState([]);

  // let userLoggedIn = currentToken ? true : false;
  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  // const  [show, setShow] = useState(userLoggedIn);

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

   //* Get all of the cards from Jobs collection that the current user owns.
  const getData = async () => {
    try {
      const { data } = await myApi.get("/jobs");
      setUserJobsArr(data.sort((a, b) => b.companyName - a.companyName));
      console.log("data: ", data);
  
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (currentToken) {
      getData();
    }
  }, [currentToken]);
  
  //* Save the new card to the Jobs collection.
  const saveNewJobCard = async (newCard) => {
    try {
      console.log("newCard: ", newCard);
      const { data, status } = await myApi.post("/jobs/creatNewCard", newCard);
      console.log("saveNewJobCard - data: ", data);
      setUserJobsArr([...userJobsArr, data]);

      return status;
  
    } catch (e) {
      console.log(e);
      return e.status;
    }
  }
  
  //* Save the updated card to the Jobs collection.
  const saveUpdateJobCard = async (cardId, updates) => {
    try {
      const { data, status } = await myApi.patch(`/jobs/updateCard/${cardId}`, updates);
      const filteredData = userJobsArr.filter(card => card._id !== cardId);
      setUserJobsArr([...filteredData, data]);
      return status;
  
    } catch (e) {
      console.log(e);
      return e.status;
    }
  }

  //* Delete the card from the Jobs collection.
  const deleteJobCard = async (cardId) => {
    try {
      const { status } = await myApi.delete(`/jobs/deleteCard/${cardId}`);
      const filteredData = userJobsArr.filter(card => card._id !== cardId);
      setUserJobsArr(filteredData);
      return status;
       
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <BrowserRouter>
        <div>
          {/* <AuthProvider> */}
            {/* <Navbar /> */}
            <Navbar currentToken={currentToken} logout={logout} logoutFromAll={logoutFromAll} />
            <Switch>
              {/* <Route path="/" exact component={Homepage} /> */}
              <Route path="/" exact >
                <Homepage currentToken={currentToken} signup={signup} login={login} error={error} setError={setError} />
              </Route>
              <Route path="/jobs" exact >
                <Jobs userJobsArr={userJobsArr} setUserJobsArr={setUserJobsArr} deleteJobCard={deleteJobCard} />
              </Route>
              {/* <Route path="/jobs" exact component={Jobs} /> */}
             <Route path="/jobs/new_card" exact >
                <JobCreateCard saveNewJobCard={saveNewJobCard} />
              </Route> 
             <Route path="/jobs/edit_card/:id" exact >
                <JobEditCard userJobsArr={userJobsArr} saveUpdateJobCard={saveUpdateJobCard} />
              </Route> 
              {/* <Route path="/jobs/new_card" exact component={JobCard} />
              <Route path="/jobs/edit_card/:id" exact component={JobCard} /> */}
              {/* <Route path="/studying" exact component={Studying} /> */}
              {/* <Route path="/studying/new_card" exact component={StudyingCard} /> */}
              {/* <Route
                path="/studying/edit_card/:id"
                exact
                component={StudyingCard}
              /> */}
              {/* <Route path="/card/:name/:id/:type" exact component={Message} /> */}
              {/* <Route path="/error/:name/:id" exact component={Message} /> */}
              <Route component={NoMatch} />
            </Switch>
          {/* </AuthProvider> */}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;