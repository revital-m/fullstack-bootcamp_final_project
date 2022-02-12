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
import StudyingGlobalCategories from "./components/StudyingGlobalCategories/StudyingGlobalCategories";
import Quiz from "./components/Quiz/Quiz";
import NoMatch from "./pages/NoMatch/NoMatch";
// import Message from "./components/Message/Message";
// import { AuthProvider } from "./context/AuthContext";
// import Signup from "./components/Signup/Signup";
import {myApi} from "./api/Api.js";

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [currentToken, setCurrentToken] = useState(localStorage.getItem("JobPreparingToken"));
  const [error, setError] = useState("");

  console.log("currentUser: ", currentUser);

  const [userJobsArr, setUserJobsArr] = useState([]);
  const [userStudyingArr, setUserStudyingArr] = useState([]);
  const [categoriesName, setCategoriesName] = useState([]);
  const [studyingCategoryId, setStudyingCategoryId] = useState("");
  const [chosenStudyingCard, setChosenStudyingCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const asyncLocalStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    getItem: function (key) {
        return Promise.resolve().then(function () {
            return localStorage.getItem(key);
        });
    }
};

  //* Signup user and add his token to local storage.
  const signup = async (password, email, name) => {
    setError("");
    let obj = {
      password: password,
      email: email,
      userName: name,
    };
    try {
      setIsLoading(true);
      const response = await myApi().post("/users/signup", obj);
      setCurrentToken(response.data.token);
      setCurrentUser(response.data.user);
      await asyncLocalStorage.setItem('JobPreparingToken', response.data.token);
      setIsLoading(false);
  
    } catch (e) {
      if (e.response.data.message) {
        setError(e.response.data.message.replace("User validation failed:", "Error -"));
      }
      else {
        setError("Unable to signup");
      }
      setIsLoading(false);
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
      setIsLoading(true);
      const response = await myApi().post("/users/login", obj);
      console.log("login: ", response);
      setCurrentToken(response.data.token);
      setCurrentUser(response.data.user);
      await asyncLocalStorage.setItem('JobPreparingToken', response.data.token);
      await asyncLocalStorage.getItem("JobPreparingToken");
      setIsLoading(false);
  
    } catch (e) {
      setError(e.response.data);
      setIsLoading(false);
    }
  }

  //* Logout user & remove his token from local storage
  const logout = async () => {
    setError("");

    try {
      setIsLoading(true);
      const response = await myApi(currentToken).post("/users/logout");
      setCurrentToken("");
      setCurrentUser(null);
      console.log(response);
      localStorage.clear();
      setIsLoading(false);

    } catch (e) {
      console.log("logout - error: ",e);
      setIsLoading(false);
      // setError(e.response.data.message);
      
    }

  }

  //* Logout from all user's devices.
  const logoutFromAll = async () => {
    setError("");
    try {
      setIsLoading(true);
      const response = await myApi(currentToken).post("/users/logoutAll");
      console.log(response);
      setCurrentToken("");
      setCurrentUser("");
      localStorage.clear();
      setIsLoading(false);
  
    } catch (e) {
      // setError(e.response.data.message);
      console.log("logoutFromAll - error: ",e);       
      setIsLoading(false);
    }
  }

  //* Get the current user's profile.
   const getUserProfile = async () => {
    setError("");
    try {
      setIsLoading(true);
      const { data } = await myApi(currentToken).get("/users/myProfile");
      // console.log("getUserProfile - response: ", response);
      setCurrentUser(data);
      setIsLoading(false);
  
    } catch (e) {
      // setError(e.response.data.message);
      console.log("logoutFromAll - error: ",e);     
      setIsLoading(false);
    }
  }

  //* Get all of the cards from Jobs collection that the current user owns.
  const getJobData = async () => {
    try {
      setIsLoading(true);
      const { data } = await myApi(currentToken).get("/jobs");
      setUserJobsArr(data.sort((a, b) => b.companyName - a.companyName));
      console.log("Job data: ", data);
      setIsLoading(false);
  
    } catch (e) {
      console.log("getJobData - error: ",e);
      setIsLoading(false);
    }
  }

  //* Get all of the cards from Jobs collection that the current user owns.
  const getStudyingData = async () => {
    try {
      setIsLoading(true);
      const { data } = await myApi(currentToken).get("/studying/allCategories");
      console.log("Studying data: ", data);
      const filteredData = data.filter(item => item.questionsArr.length !== 0);
      setUserStudyingArr(filteredData);
      setIsLoading(false);
  
    } catch (e) {
      console.log("getStudyingData - error: ");
      console.table(e);
      setIsLoading(false);
    }
  }
  
  //* Save the new card to the Jobs collection.
  const saveNewJobCard = async (newCard) => {
    try {
      setIsLoading(true);
      console.log("newCard: ", newCard);
      const { data, status } = await myApi(currentToken).post("/jobs/creatNewCard", newCard);
      console.log("saveNewJobCard - data: ", data);
      setUserJobsArr([...userJobsArr, data]);
      setIsLoading(false);
      return status;
  
    } catch (e) {
      console.log("saveNewJobCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }
  
  //* Save the updated card to the Jobs collection.
  const saveUpdateJobCard = async (cardId, updates) => {
    try {
      setIsLoading(true);
      const { data, status } = await myApi(currentToken).patch(`/jobs/updateCard/${cardId}`, updates);
      const filteredData = userJobsArr.filter(card => card._id !== cardId);
      setUserJobsArr([...filteredData, data]);
      setIsLoading(false);
      return status;
  
    } catch (e) {
      console.log("saveUpdateJobCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Delete the card from the Jobs collection.
  const deleteJobCard = async (cardId) => {
    try {
      setIsLoading(true);
      const { status } = await myApi(currentToken).delete(`/jobs/deleteCard/${cardId}`);
      await getJobData();
      setIsLoading(false);
      return status;
       
    } catch (e) {
      console.log("deleteJobCard - error: ",e);
      setIsLoading(false);
    }
  }

  //* Gat all the categories names from the Studying collection.
  const getCategories = async () => {
    try {
      setIsLoading(true);
      const { data } = await myApi(currentToken).get("/studying/categoriesName");
      setCategoriesName(data)
      setIsLoading(false);
       
    } catch (e) {
      console.log("getCategories - error: ",e);
      setIsLoading(false);
    }
  }

  //* Save a new category to the User collection.
  const saveNewStudyingCardToUser = async (newCard) => {
    try {
      setIsLoading(true);
      console.log("newCard: ", newCard);
      const res = await myApi(currentToken).patch("/users/addNewCard", newCard);
      console.log("userStudying - res: ", res);
      await getStudyingData();
      await getCategories();
      setIsLoading(false);
      return res.status;
         
    } catch (e) {
      console.log("getCategories - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Save a new category to the Studying collection.
  const saveNewCategoryCard = async (newCategory) => {
    try {
      setIsLoading(true);
      console.log("newCategory: ", newCategory);
      const { data, status } = await myApi(currentToken).post("/studying/creatNewCategory", newCategory);
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
      setIsLoading(false);
      return response;
       
    } catch (e) {
      console.log("saveNewCategoryCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Save a new question to an existing category in the Studying collection.
  const saveNewQuestionCard = async (newQuestion) => {
    try {
      setIsLoading(true);
      console.log("newQuestion: ", newQuestion);
      const { data, status } = await myApi(currentToken).patch("/studying/creatNewCard", newQuestion);
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
      setIsLoading(false);
      return response;
       
    } catch (e) {
      console.log("saveNewQuestionCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Update a question in an existing category in the Studying collection.
  const updateQuestionCard = async (updates) => {
    try {
      setIsLoading(true);
      console.log("updates: ", updates);
      const { status } = await myApi(currentToken).patch(`/studying/updateCard/${chosenStudyingCard._id}/${studyingCategoryId}`, updates);
      await getStudyingData();
      setIsLoading(false);
      return status;
       
    } catch (e) {
      console.log("updateQuestionCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Remove a question in an existing category in the user collection.
  const removeQuestionCard = async () => {
    try {
      setIsLoading(true);
      const { status } = await myApi(currentToken).delete(`/studying/removeCardFromUser/${chosenStudyingCard._id}/${studyingCategoryId}`);
      await getStudyingData();
      setIsLoading(false);
      return status;
       
    } catch (e) {
      console.log("removeQuestionCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Delete a question in an existing category in the studying collection.
  const deleteQuestionCard = async () => {
    try {
      setIsLoading(true);
      const { status } = await myApi(currentToken).delete(`/studying/deleteCardFromStudying/${chosenStudyingCard._id}/${studyingCategoryId}`);
      const response = await removeQuestionCard();
      await getStudyingData();
      setIsLoading(false);
      return response;
       
    } catch (e) {
      console.log("removeQuestionCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Get all of the users chosen global categories from the studying collection.
  const getGlobalCards = async (categoriesObj) => {
    try {
      setIsLoading(true);
      console.log("categoriesObj: ", categoriesObj);
      const { status } = await myApi(currentToken).post('studying/globalCategories', categoriesObj);
      await getStudyingData();
      setIsLoading(false);
      return status;
      // console.log(res);
       
    } catch (e) {
      console.log("removeQuestionCard - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Add question to the quiz by category.
  const addQuestionToQuiz = async (quizCategoryId) => {
    try {
      setIsLoading(true);
      console.log("quizCategoryId: ", quizCategoryId);
      const questionToAdd = {
        question: "(Q10) Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente repellat dolor optio labore vero quod magni velit nam quis harum.",
        optionsArr: [
            {
                answer: "(A10.1) Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, labore!",
                correct: true
            },
                    {
                answer: "(A10.2) Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, labore!",
                correct: false
            },
                    {
                answer: "(A10.3) Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, labore!",
                correct: false
            },
                    {
                answer: "(A10.4) Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus, labore!",
                correct: false
            }
        ]
    }
      console.log("questionToAdd: ", questionToAdd);
      const response = await myApi(currentToken).patch(`/studying/quizQuestion/${quizCategoryId}`, questionToAdd);
      // return status;
      console.log("addQuestionToQuiz- response: ", response);
      setIsLoading(false);
       
    } catch (e) {
      console.log("addQuestionToQuiz - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Get the quiz questions by category.
  const getQuiz = async (quizCategoryId) => {
    try {
      setIsLoading(true);
      const { data } = await myApi(currentToken).get(`/studying/quizByCategory/${quizCategoryId}`);
      setIsLoading(false);
      return data;
      // console.log("addQuestionToQuiz- response: ", response);
       
    } catch (e) {
      console.log("addQuestionToQuiz - error: ",e);
      setIsLoading(false);
      return e;
    }
  }

  //* Check the user's answers and update the importance.
  const checkQuiz = async (userQuizAnswer) => {
    try {
      setIsLoading(true);
      const bodyObj = {
        userAnswers: userQuizAnswer
      };
      const response = await myApi(currentToken).patch(`/studying/checkQuiz/${studyingCategoryId}`, bodyObj);
      await getUserProfile();
      setIsLoading(false);
      return response;
       
    } catch (e) {
      console.log("checkQuiz - error: ");
      console.table(e);
      setIsLoading(false);
      return e;
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
            <Navbar currentToken={currentToken} logout={logoutFromAll} logoutFromAll={logoutFromAll} />
            <Switch>
              <Route path="/" exact >
                <Homepage currentToken={currentToken} signup={signup} login={login} error={error} setError={setError} isLoading={isLoading} />
              </Route>
              <Route path="/jobs" exact >
                <Jobs userJobsArr={userJobsArr} setUserJobsArr={setUserJobsArr} deleteJobCard={deleteJobCard} />
              </Route>
             <Route path="/jobs/new_card" exact >
                <JobCreateCard saveNewJobCard={saveNewJobCard} />
              </Route> 
             <Route path="/jobs/edit_card/:id" exact >
                <JobEditCard userJobsArr={userJobsArr} saveUpdateJobCard={saveUpdateJobCard} />
              </Route> 
              <Route path="/studying" exact >
                <Studying userStudyingArr={userStudyingArr} currentUser={currentUser} setStudyingCategoryId={setStudyingCategoryId} setChosenStudyingCard={setChosenStudyingCard} removeQuestionCard={removeQuestionCard} deleteQuestionCard={deleteQuestionCard} />
              </Route>
              <Route path="/studying/new_card" exact >
                <StudyingCreateCard categoriesName={categoriesName} saveNewCategoryCard={saveNewCategoryCard} saveNewQuestionCard={saveNewQuestionCard} />
              </Route>
              <Route path="/studying/edit_card" exact >
                <StudyingEditCard updateQuestionCard={updateQuestionCard} chosenStudyingCard={chosenStudyingCard} />
              </Route>
              <Route path="/studying/globalCategories" exact >
                <StudyingGlobalCategories getGlobalCards={getGlobalCards} categoriesName={categoriesName} />
              </Route>
              <Route path="/studying/quiz" exact >
                <Quiz addQuestionToQuiz={addQuestionToQuiz} userStudyingArr={userStudyingArr} getQuiz={getQuiz} setStudyingCategoryId={setStudyingCategoryId} checkQuiz={checkQuiz} setCurrentUser={setCurrentUser} currentUser={currentUser} />
              </Route>
              <Route component={NoMatch} />
            </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;