// @flow
import React from 'react';
import ReactDOM from 'react-dom/lib/ReactDOM';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { routerReducer, syncHistoryWithStore } from 'react-router-redux';
import * as reducerModules from 'modules';
import { hashHistory, browserHistory } from 'react-router';
import { isProduction } from 'config/constants';
import getRoutes from 'config/routes';
import { checkIfAuthed } from 'helpers/auth';

const store = createStore(combineReducers(
    {...reducerModules, routing: routerReducer}),
compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
)
);
const whichHistory = isProduction ? browserHistory : hashHistory;
// const whichHistory = browserHistory;
const history = syncHistoryWithStore(whichHistory, store);

function checkAuth (nextState, replace) {
    // if(store.getState().users.get('isFetching') === true){
    //   return
    // }
    const isAuthed = checkIfAuthed(store);
    const nextPath = nextState.location.pathname;

    if (isAuthed) {
        if (nextPath === '/') {
            replace('/record');
        }
    } else {
        if (nextPath === '/record') {
            replace('/signin');
        }
    }
}

const mode = isProduction === true ? 'production' : 'development';
console.log(`bikebump running (${mode})`);

let app = ((document.getElementById('app'): any): HTMLElement);
app.style.height = '100%';
app.style.width = '100%';
// app.style.display = 'flex'

ReactDOM.render(
    <Provider store={store}>
        {getRoutes(checkAuth, history)}
    </Provider>,
    app
);
