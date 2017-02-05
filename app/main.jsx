import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import styles from './main.scss';

// create container element on DOM
const container = document.createElement('div'); // eslint-disable-line no-undef
container.setAttribute('class', styles.appContainer);
document.body.append(container); // eslint-disable-line no-undef

ReactDOM.render(<App />, container);
