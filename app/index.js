import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { routerReducer, syncHistoryWithStore } from 'react-router-redux'
import * as reducerModules from 'modules'
import { hashHistory } from 'react-router'

import getRoutes from 'config/routes'

const store = createStore(combineReducers(
  {...reducerModules, routing: routerReducer}),
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f)=>f 
  )
)

const history = syncHistoryWithStore(hashHistory,store)

ReactDOM.render(
    <Provider store={store}>
      {getRoutes(history)}
    </Provider>,
    document.getElementById('app')
  )