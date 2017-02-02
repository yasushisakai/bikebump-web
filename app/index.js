import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { routerReducer, syncHistoryWithStore } from 'react-router-redux'
import * as reducerModules from 'modules'
import { hashHistory, browserHistory } from 'react-router'
import { isProduction } from 'config/constants'
import getRoutes from 'config/routes'
import { checkIfAuthed } from 'helpers/auth'

const store = createStore(combineReducers(
  {...reducerModules, routing: routerReducer}),
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f)=>f 
  )
)
const witchHistory = isProduction ? browserHistory : hashHistory
const history = syncHistoryWithStore(witchHistory,store)

function checkAuth (nextState, replace) {
  if(store.getState().users.get('isFetching') === true){
    return
  }

  const isAuthed = checkIfAuthed(store)
  const nextPath = nextState.location.pathname

  if(isProduction===true){
    if(nextPath==='/map' || nextPath==='/admin'){
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
}

const mode = isProduction === true ? 'production': 'development' 
console.log(`bikebump running (${mode})`)


ReactDOM.render(
    <Provider store={store}>
      {getRoutes(checkAuth,history)}
    </Provider>,
    document.getElementById('app')
  )