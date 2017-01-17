import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { routerReducer, syncHistoryWithStore } from 'react-router-redux'
import * as reducerModules from 'modules'
import { hashHistory } from 'react-router'

import getRoutes from 'config/routes'
import { checkIfAuthed } from 'helpers/auth'

const store = createStore(combineReducers(
  {...reducerModules, routing: routerReducer}),
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f)=>f 
  )
)

const history = syncHistoryWithStore(hashHistory,store)

function checkAuth (nextState, replace) {
  if(store.getState().users.get('isFetching') === true){
    return
  }

  const isAuthed = checkIfAuthed(store)
  const nextPath = nextState.location.pathname

  if(nextPath==='/map'){
    return
  }else if (nextPath === '/' || nextPath == '/signin') {
    if(isAuthed === true) {
      replace('/record')
    } 
  } else {
    if(isAuthed !== true){
      replace('/signin')
    }
  }  
}




ReactDOM.render(
    <Provider store={store}>
      {getRoutes(checkAuth,history)}
    </Provider>,
    document.getElementById('app')
  )