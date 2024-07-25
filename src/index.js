/*
👋 “Hey” from the Praxis team
Praxis ships with support for modern browsers, but you may have users or external vendors that require IE11.
If that’s the case - uncomment the below imports.
Learn more about our the default browser support in the README.

import '@praxis/react-app-polyfill/ie11'
import '@praxis/react-app-polyfill/stable'
*/

//import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
