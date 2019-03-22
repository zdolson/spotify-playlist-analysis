import React, {Component} from 'react';
import {connect} from 'react-redux';

import {handleLogin} from '../store/actions/general';

class Login extends Component {
  handleSubmit = (e) => {
    this.props.dispatch(handleLogin(() => {
      if (this.props.authenticated) {
        let url = this.props.redirectUrl;
        console.log('url: ', url);
        return this.props.history.push(url.substring(url.indexOf('auth')));
      }
    }));
  }

  render() {
    // const {authenticated, redirectUrl} = this.props;
    // <button
    //   onClick={() => this.handleSubmit()}>
    //   Sign-in with Spotify
    // </button>
    return (
      <div className='d-flex justify-content-center align-items-center h-75'>
        <div className='thick-border bg-light border border-success border-rounded p-4 w-25'>
          <h2>Spotify Thing</h2>
          <p>This web app, upon approval through button below, will enable the
             application to analyze certain metrics for all Spotify songs in a
             selected playlist and display aggregated information.
          </p>
          <a href='http://localhost:3001/login'>Sign-in with Spotify</a>
        </div>
      </div>
    )
  }
}

export default connect(({loading, general: {redirectUrl, authenticated}}) => ({
  redirectUrl,
  authenticated,
  loading
}))(Login);