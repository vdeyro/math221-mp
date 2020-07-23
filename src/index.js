import React from 'react';
import { render } from 'react-dom';
import reducers from './reducers';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

export const store = createStore(reducers)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);

