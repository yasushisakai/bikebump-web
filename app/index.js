import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { routerReducer, syncHistoryWithStore } from 'react-router-redux'
import * as reducerModules from 'modules'
import { hashHistory } from 'react-router'

import getRoutes from 'config/routes'
import {  getCurrentUser } from 'helpers/auth'

const store = createStore(combineReducers(
  {...reducerModules, routing: routerReducer}),
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f)=>f 
  )
)

const history = syncHistoryWithStore(hashHistory,store)

function checkAuth () {
  // checks if...

  // 1. if firebase.auth().currentUser is not null
  //    if true check if the state knows that

  // 2. if there
  const currentUser = getCurrentUser()
  console.log(currentUser)
}


ReactDOM.render(
    <Provider store={store}>
      {getRoutes(checkAuth,history)}
    </Provider>,
    document.getElementById('app')
  )