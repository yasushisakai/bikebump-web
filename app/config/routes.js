import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import { 
  MainContainer,
  HomeContainer,
  RecordContainer,
  MapVisContainer,
  RoadsContainer,
  UserContainer,
  PickContainer,
  AuthContainer,
  LogoutContainer,
  ClearContainer,
  AdminContainer,
  TestContainer,
} from 'containers'

export default function getRoutes(checkAuth, history){
  return(
    <Router history={history}>
      <Route path='/' component={MainContainer}>
        <Route path='record' component={RecordContainer} onEnter={checkAuth} />
        <Route path='map' component={MapVisContainer} onEnter={checkAuth} />
        <Route path='roads/:roadId' component={RoadsContainer} onEnter={checkAuth} />
        <Route path='user/:uid' component={UserContainer} onEnter={checkAuth} />
        <Route path='pick' component={PickContainer} onEnter={checkAuth} />
        <Route path='signin' component={AuthContainer} onEnter={checkAuth}/>
        <Route path='logout' component={LogoutContainer} />
        <Route path='clear' component={ClearContainer} />
        <Route path='admin' component={AdminContainer} onEnter={checkAuth}>
          <Route path=':uid/test' component={TestContainer}/>
        </Route>
        <IndexRoute component={HomeContainer} onEnter={checkAuth}/>
      </Route>
    </Router>
    )
}