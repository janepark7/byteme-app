import './App.scss';
import React from 'react';
import { BrowserRouter, Switch, Route,  } from "react-router-dom";
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';


// redux setup ##########################################
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers";

const history = createHistory();

const store = createStore(reducers, window._INITIAL_REDUX_STATE, applyMiddleware(reduxThunk, routerMiddleware(history)));

import Home from "pages/Home";
import Navigation from "./components/Navigation";
import SignUp from "pages/SignUp";
import Login from "pages/Login";
import UserAdmin from "pages/UserAdmin";
import Upload from "pages/Upload";
import PageError from "pages/404";


class App extends React.Component {
  constructor(props) {
    super(props); {
      // this.state = getState();
    }

  }


  _requireAuth = (nextState, replace) => {
    if (isLoggedIn) {
      console.log("app.js; _requireAuth: true")
      replace({
        pathname: "/useradmin",
      });
    }
    else if (!isLoggedIn) {
      console.log("app.js; _requireAuth: false")
      replace({
        pathname: "/login",
      })
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div className="navbar">
            <Navigation/>
            <Switch>
              <Route exact path= "/" component={Home}/>
              <Route exact path="/Signup" component={SignUp} onEnter={this._requireAuth}/>
              <Route exact path="/Login" component={Login} onEnter={this._requireAuth}/>
              <Route exact path="/UserAdmin" component={UserAdmin} onEnter={this._requireAuth}/>
              <Route exact path="/Upload" component={Upload} />
              <Route exact path="/*" component={PageError}/>
            </Switch>
            </div>
          </ConnectedRouter>
        </Provider>
      );
    }
}

export default App;
