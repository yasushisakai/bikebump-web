import React from 'react';
import {browserHistory ,Router, Route, IndexRoute} from 'react-router';

import Base from './components/Base'
import MainContainer from './container/MainContainer'
import MapContainer from './container/MapContainer'
import NotFound from './components/NotFound'

//
// this handles the routing for the app
// for the api endpoint urls look inside /api/routes.js
//


// TODO: login stuff
export const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={Base}>
            <IndexRoute component={MainContainer}/>
            <Route path="map" component={MapContainer}/>
            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
);



