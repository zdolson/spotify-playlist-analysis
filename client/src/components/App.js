import React, { Component } from 'react';
import {connect} from 'react-redux';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Login from './Login';
import Home from './Home';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='bg-dark container-fluid vh-100'>
          <Switch>
            <Route exact path='/' component={Login}/>
            <Route path='/auth/:tokens' render={({match}) => {
              let tokens = match;
              console.log('tokens: ', tokens);
              return <Redirect to={{
                pathname: '/home/',
                state: {
                  tokens,
                }
              }} />
            }} />
          <Route path='/home/' component={Home}/>
            <Route path='/err/:error' render={() => (<p>Auth Error</p>)}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

// export default App;
export default connect(({general: {authenticated, redirectUrl}}) => ({
  authenticated,
  redirectUrl
}))(App);
