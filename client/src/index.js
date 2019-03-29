import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';
import {Provider} from 'react-redux';
import store from './store';
// import * as serviceWorker from './serviceWorker';

const renderApp = () =>
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./components/App', renderApp)
}

renderApp();

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
