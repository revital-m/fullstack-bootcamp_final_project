import React, { useEffect, useState } from "react";
import { Switch, BrowserRouter, Route, Link } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import Jobs from "./pages/Jobs/Jobs";
import JobCreateCard from "./components/JobCreateCard/JobCreateCard";
import JobEditCard from "./components/JobEditCard/JobEditCard";
import Studying from "./pages/Studying/Studying";
import StudyingCreateCard from "./components/StudyingCreateCard/StudyingCreateCard";
import StudyingEditCard from "./components/StudyingEditCard/StudyingEditCard";
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
  const [userStudyingArr, setUserStudyingArr] = useState([]);
  const [categoriesName, setCategoriesName] = useState([]);
  const [studyingCardId, setStudyingCardId] = useState("");
  const [studyingCategoryId, setStudyingCategoryId] = useState("");
  const [isGlobalCard, setIsGlobalCard] = useState(false);
  const [chosenStudyingCard, setChosenStudyingCard] = useState({});

  // let userLoggedIn = currentToken ? true : false;
  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  // const  [show, setShow] = useState(userLoggedIn);

  //* Signup user and add his token to local storage.
  const signup = async (password, email, name) => {
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
  const login = async (email, password) => {
    setError("");
    let obj = {
      email: email,
      password: password,
    };
    try {
      const response = await myApi.post("/users/login", obj);
      console.log("login: ", response);
      setCurrentToken(response.data.token);
      setCurrentUser(response.data.user);
      localStorage.setItem('JobPreparingToken', response.data.token);
  
    } catch (e) {
      setError(e.response.data);
    }
  }

  //* Logout user & remove his token from local storage
  const logout = async () => {
    setError("");

    try {
      const response = await myApi.post("/users/logout");
      setCurrentToken("");
      setCurrentUser(null);
      console.log(response);
      localStorage.clear();

    } catch (e) {
      console.log("logout - error: ",e);
      // setError(e.response.data.message);
      
    }

  }

  //* Logout from all user's devices.
  const logoutFromAll = async () => {
    setError("");
    try {
      const response = await myApi.post("/users/logoutAll");
      console.log(response);
      setCurrentToken("");
      setCurrentUser(null);
      localStorage.clear();
  
    } catch (e) {
      // setError(e.response.data.message);
      console.log("logoutFromAll - error: ",e);        
    }
  }

  //* Get the current user's profile.
   const getUserProfile = async () => {
    setError("");
    try {
      const { data } = await myApi.get("/users/myProfile");
      // console.log("getUserProfile - response: ", response);
      setCurrentUser(data);
  
    } catch (e) {
      // setError(e.response.data.message);
      console.log("logoutFromAll - error: ",e);        
    }
  }

  //* Get all of the cards from Jobs collection that the current user owns.
  const getJobData = async () => {
    try {
      const { data } = await myApi.get("/jobs");
      setUserJobsArr(data.sort((a, b) => b.companyName - a.companyName));
      console.log("Job data: ", data);
  
    } catch (e) {
      console.log("getJobData - error: ",e);
    }
  }

  //* Get all of the cards from Jobs collection that the current user owns.
  const getStudyingData = async () => {
    try {
      const { data } = await myApi.get("/studying/allCategories");
      console.log("Studying data: ", data);
      setUserStudyingArr(data);
  
    } catch (e) {
      console.log("getStudyingData - error: ");
      console.table(e);
    }
  }
  
  //* Save the new card to the Jobs collection.
  const saveNewJobCard = async (newCard) => {
    try {
      console.log("newCard: ", newCard);
      const { data, status } = await myApi.post("/jobs/creatNewCard", newCard);
      console.log("saveNewJobCard - data: ", data);
      setUserJobsArr([...userJobsArr, data]);
      return status;
  
    } catch (e) {
      console.log("saveNewJobCard - error: ",e);
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
      console.log("saveUpdateJobCard - error: ",e);
      return e.status;
    }
  }

  //* Delete the card from the Jobs collection.
  const deleteJobCard = async (cardId) => {
    try {
      const { status } = await myApi.delete(`/jobs/deleteCard/${cardId}`);
      await getJobData();
      return status;
       
    } catch (e) {
      console.log("deleteJobCard - error: ",e);
    }
  }

  //* Gat all the categories names from the Studying collection.
  const getCategories = async () => {
    try {
      const { data } = await myApi.get("/studying/categoriesName");
      setCategoriesName(data)
       
    } catch (e) {
      console.log("getCategories - error: ",e);
    }
  }

  //* Save a new category to the User collection.
  const saveNewStudyingCardToUser = async (newCard) => {
    try {
      console.log("newCard: ", newCard);
      const res = await myApi.patch("/users/addNewCard", newCard);
      console.log("userStudying - res: ", res);
      await getStudyingData();
      await getCategories();
      return res.status;
         
    } catch (e) {
      console.log("getCategories - error: ",e);
      return e.status;
    }
  }

  //* Save a new category to the Studying collection.
  const saveNewCategoryCard = async (newCategory) => {
    try {
      console.log("newCategory: ", newCategory);
      const { data, status } = await myApi.post("/studying/creatNewCategory", newCategory);
      if (status !== 201) {
        return status;
      }

      const categoryToAdd = {
        categoryID: data._id,
        questionID: data.questionsArr[0]._id
      } 
      const response = await saveNewStudyingCardToUser(categoryToAdd);
      // setCategoriesName(data)
      console.log("saveNewCategoryCard - response: ", response);
      return response;
       
    } catch (e) {
      console.log("saveNewCategoryCard - error: ",e);
      return e.status;
    }
  }

  //* Save a new question to an existing category in the Studying collection.
  const saveNewQuestionCard = async (newQuestion) => {
    try {
      console.log("newQuestion: ", newQuestion);
      const { data, status } = await myApi.patch("/studying/creatNewCard", newQuestion);
      if (status !== 201) {
        return status;
      }

      const categoryToAdd = {
        categoryID: data._id,
        questionID: data.questionsArr[data.questionsArr.length - 1]._id
      } 
      const response = await saveNewStudyingCardToUser(categoryToAdd);
      // setCategoriesName(data)
      console.log("saveNewQuestionCard - response: ", response);
      return response;
       
    } catch (e) {
      console.log("saveNewQuestionCard - error: ",e);
      return e.status;
    }
  }

  //* Update a question in an existing category in the Studying collection.
  const updateQuestionCard = async (updates) => {
    try {
      console.log("updates: ", updates);
      const { status } = await myApi.patch(`studying/updateCard/${chosenStudyingCard._id}/${studyingCategoryId}`, updates);
      await getStudyingData();
      return status;
       
    } catch (e) {
      console.log("updateQuestionCard - error: ",e);
      return e.status;
    }
  }

  useEffect(() => {
    if (currentToken) {
      getJobData();
      getStudyingData();
      getCategories();
      getUserProfile();
    }
  }, [currentToken]);

  return (
    <div>
      <BrowserRouter>
        <div>
          {/* <AuthProvider> */}
            {/* <Navbar /> */}
            <Navbar currentToken={currentToken} logout={logoutFromAll} logoutFromAll={logoutFromAll} />
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
              <Route path="/studying" exact >
                <Studying userStudyingArr={userStudyingArr} currentUser={currentUser} setStudyingCategoryId={setStudyingCategoryId} setChosenStudyingCard={setChosenStudyingCard} />
              </Route>
              <Route path="/studying/new_card" exact >
                <StudyingCreateCard categoriesName={categoriesName} saveNewCategoryCard={saveNewCategoryCard} saveNewQuestionCard={saveNewQuestionCard} />
              </Route>
              <Route path="/studying/edit_card" exact >
                <StudyingEditCard updateQuestionCard={updateQuestionCard} chosenStudyingCard={chosenStudyingCard} />
              </Route>
              {/* <Route path="/studying" exact component={Studying} /> */}
              {/* <Route path="/studying/new_card" exact component={StudyingCard} /> */}
              {/* <Route path="/studying/edit_card/:id" exact component={StudyingCard} /> */}
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