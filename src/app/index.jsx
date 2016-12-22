import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory ,Router, Route, IndexRoute} from 'react-router';


import BaseContainer from './container/BaseContainer'
import MainContainer from './container/MainContainer'
import HeatMapContainer from './container/HeatMapContainer'
import MapContainer from './container/MapContainer'
import MapAllRoadContainer from './container/MapAllRoadContainer'
import RingDetectionContainer from './container/RingDetectionContainer';
import BreadCrumbContainer from './container/BreadcrumbContainer';

import Login from './container/GoogleLogin'
import NotFound from './components/NotFound'

const root = document.getElementById('root');

function requireAuth() {
    if (!localStorage.token) {
        window.location="/";
    }
}

const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={BaseContainer}>
            <IndexRoute component={Login}/>
            <Route path="app" component={MainContainer} onEnter={requireAuth}/>
            <Route path="heat_map" component={HeatMapContainer} onEnter={requireAuth}/>
            <Route path="detect_rings" component={RingDetectionContainer} />
            <Route path="map" component={MapContainer} onEnter={requireAuth}/>
            <Route path="map_all" component={MapAllRoadContainer} onEnter={requireAuth}/>
            <Route path="breadcrumb" component={BreadCrumbContainer}/>
            <Route path="users/:user" component={HeatMapContainer} onEnter={requireAuth}/>
        </Route>
        <Route path="*" component={NotFound}/>
    </Router>
);


ReactDOM.render(
    routes,
    root
);
