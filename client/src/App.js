import React, { useEffect, useState } from "react";
import { Switch, BrowserRouter, Route, Link } from "react-router-dom";
import "./App.css";
// import myApi from './api/Api';
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./pages/Homepage/Homepage";
import Jobs from "./pages/Jobs/Jobs";
import JobCard from "./components/JobCard/JobCard";
// import Studying from "./pages/Studying/Studying";
// import StudyingCard from "./components/StudyingCard/StudyingCard";
import NoMatch from "./pages/NoMatch/NoMatch";
// import Message from "./components/Message/Message";
import { AuthProvider } from "./context/AuthContext";
// import Signup from "./components/Signup/Signup";

function App() {
  // const { currentUser, currentToken } = useAuth();
  // const [user, setUser] = useState(false);

  // useEffect(() => {
  //   if (currentUser) {
  //     setUser(true);
  //   }
  // }, [currentUser]);
  

  return (
    <div>
      <BrowserRouter>
        <div>
          <AuthProvider>
            <Navbar />
            <Switch>
              <Route path="/" exact component={Homepage} />
              <Route path="/jobs" exact component={Jobs} />
              <Route path="/jobs/new_card" exact component={JobCard} />
              <Route path="/jobs/edit_card/:id" exact component={JobCard} />
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
          </AuthProvider>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;