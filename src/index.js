import React from 'react';
import { render } from 'react-dom';
import reducers from './reducers';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
export const store = createStore(reducers, composeEnhancers())

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);

