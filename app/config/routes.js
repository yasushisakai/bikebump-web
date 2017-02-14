import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import { 
  MainContainer,
  HomeContainer,
  RecordContainer,
  MapVisContainer,
  RoadsContainer,
  UserContainer,
  AuthContainer,
  LogoutContainer,
  ClearContainer,
  RespondContainer,
  SoundClipContainer,
  PlaySoundContainer,
  RoadVisContainer,
  CalibrateContainer,
  LayoutContainer,
} from 'containers'

export default function getRoutes(checkAuth, history){
  return(
    <Router history={history}>
      <Route path='/' component={MainContainer}>
        <Route path='record' component={RecordContainer} onEnter={checkAuth} />
        <Route path='map' component={MapVisContainer} onEnter={checkAuth} />
        <Route path='roads/:roadId' component={RoadsContainer} onEnter={checkAuth} />
        <Route path='user/:uid' onEnter={checkAuth} >
          <Route path='calibrate' component={CalibrateContainer} onEnter={checkAuth} />
          <IndexRoute component={UserContainer} onEnter={checkAuth} />
        </Route>
        <Route path='signin' component={AuthContainer} onEnter={checkAuth}/>
        <Route path='logout' component={LogoutContainer} />
        <Route path='clear' component={ClearContainer} />
        <Route path='respond' component={RespondContainer} onEnter={checkAuth}/>
        <Route path='tests' onEnter={checkAuth} >
          <Route path='playSound' component={PlaySoundContainer} onEnter={checkAuth}/>
          <Route path='layout' component={LayoutContainer} onEnter={checkAuth}/>
        </Route>
        <IndexRoute component={HomeContainer} onEnter={checkAuth}/>
      </Route>
    </Router>
    )
}