import React from "react";
// import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
// import { UserContext } from "app/contexts";
const Home = React.lazy(() => import("./pages/home/index"));
const Courses = React.lazy(() => import("./pages/courses/index"));
const Subjects = React.lazy(() => import("./pages/subjects/index"));
const Chapters = React.lazy(() => import("./pages/chapters/index"));
const Topics = React.lazy(() => import("./pages/topics/index"));
const Users = React.lazy(() => import("./pages/users/index"));
const Boards = React.lazy(() => import("./pages/boards/index"));

const AppRoutes = props => {
  // const { user } = useContext(UserContext);
  return (
    <>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/courses">
          <Courses />
        </Route>
        <Route exact path="/subjects">
          <Subjects />
        </Route>
        <Route exact path="/chapters">
          <Chapters />
        </Route>
        <Route exact path="/topics">
          <Topics />
        </Route>
        <Route exact path="/users">
          <Users />
        </Route>
        <Route exact path="/boards">
          <Boards />
        </Route>
      </Switch>
    </>
  );
};

export default AppRoutes;
