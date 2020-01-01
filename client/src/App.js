import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Redux imports
import { Provider } from 'react-redux';
import store from './store';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={ store }>
      <BrowserRouter>
        <Fragment>
            <Navbar />
            <Route exact path="/" component={ Landing } />
            <section className="container">
              <Switch>
                <Route exact path="/register" component={ Register } />
                <Route exact path="/login" component={ Login } />
              </Switch>
            </section>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
