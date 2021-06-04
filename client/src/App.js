import "./App.css";
import Axios from "axios";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import NavigationBar from "./components/NavBar/NavBar";
import PackagePage from "./Pages/PagckagePage";
import ResourcePage from "./Pages/ResourcePage";
import {Error} from "./Pages/Error";
import SearchPage from "./Pages/SearchPage";
import "@fontsource/roboto";

function App() {
  return (
    <>
    
    <Router>
    <NavigationBar />
        <Switch>
        
          <Route path="/delete" exact component={Dashboard} />
          <Route path="/packages" exact component={PackagePage} />
          <Route path="/" exact component={SearchPage} />
          <Route path="*">
            <Error></Error>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
