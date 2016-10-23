import React from 'react';
import {browserHistory ,Router, Route, IndexRoute} from 'react-router';

import BaseContainer from './container/BaseContainer'
import MainContainer from './container/MainContainer'
import HeatMapContainer from './container/HeatMapContainer'
import MapContainer from './container/MapContainer'
import MapAllRoadContainer from './container/MapAllRoadContainer'
import NotFound from './components/NotFound'

//
// this handles the routing for the app
// for the api endpoint urls look inside /api/api_routes.js
//

// TODO: login stuff
export const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={BaseContainer}>
            <IndexRoute component={MainContainer}/>
            <Route path="heat_map" component={HeatMapContainer}/>
            <Route path="map" component={MapContainer}/>
            <Route path="map_all" component={MapAllRoadContainer}/>
            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
);



