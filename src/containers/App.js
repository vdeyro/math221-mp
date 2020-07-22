import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

// Samples
import Home from './Home';
import RegulaFalsi from './RegulaFalsi';
import BairStows from './BairStows';

import history from '../history'




class App extends React.Component {
  render () {
    return (
      <div className="ui container">
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/regula-falsi" exact component={RegulaFalsi} />
            <Route path="/bairstows" exact component={BairStows} />
            {/* <Route path="*" exact component={Error404} /> */}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;