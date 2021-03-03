import React, { Fragment, useState, useEffect } from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Todos from './components/Todos';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  }

  const isAuth = async() => {
    try {
      const response = await fetch("/auth/is-verify", {
        method: "GET",
        headers: { token : localStorage.token }
      });

      const parseRes = await response.json();
      
      parseRes === true ? setIsAuthenticated(true): setIsAuthenticated(false);
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, [])

  return (
    <Fragment>
      <Router>
          <Switch>
            <Route exact path="/" render={props => !isAuthenticated ? <Landing {...props} /> : <Redirect to="/todos" />} />
            <Route exact path="/login" render={props => !isAuthenticated ? <Login {...props} setAuth={setAuth} /> : <Redirect to="/todos" />} />
            <Route exact path="/register" render={props => !isAuthenticated ? <Register {...props} setAuth={setAuth} /> : <Redirect to="/login" />} />
            <Route exact path="/todos" render={props => isAuthenticated ? <Todos {...props} setAuth={setAuth} /> : <Redirect to="/login" />} />
          </Switch>
      </Router>
    </Fragment>
  );
}

export default App;