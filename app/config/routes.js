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
  AddResponseVotesContainer,
  AdminContainer,
  TestContainer,
  RespondContainer,
  SoundClipContainer,
  PlaySoundContainer,
  RoadVisContainer,
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
        <Route path='testAdd/:uid' component={AddResponseVotesContainer} />
        <Route path='respond' component={RespondContainer} onEnter={checkAuth}/>
        <Route path='soundclip' component={SoundClipContainer} onEnter={checkAuth}/>
        <Route path='playSound' component={PlaySoundContainer} onEnter={checkAuth}/>
        <Route path='roadVis' component={RoadVisContainer} onEnter={checkAuth}/>
        <Route path='admin' component={AdminContainer} onEnter={checkAuth}>
          <Route path=':uid/test' component={TestContainer}/>
        </Route>
        <IndexRoute component={HomeContainer} onEnter={checkAuth}/>
      </Route>
    </Router>
    )
}