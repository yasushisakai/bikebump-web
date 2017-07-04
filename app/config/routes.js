import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { isProduction } from 'config/constants';

import {
  MainContainer,
  HomeContainer,
  RecordContainer,
  MapVisContainer,
  UserContainer,
  AuthContainer,
  LogoutContainer,
  ClearContainer,
  RecordSoundContainer,
  RespondContainer,
  PlaySoundContainer,
  RoadVisContainer,
  CalibrateContainer,
  LayoutContainer,
  ProposalListContainer,
  ProposalContainer,
} from 'containers';

function hashLinkScroll () {
  if (!isProduction) return;
  const { hash } = window.location;
  if (hash !== '') {
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }, 0);
  }
}

export default function getRoutes (checkAuth, history) {
  return (
    <Router history={history} onUpdate={hashLinkScroll}>
      <Route path='/' component={MainContainer}>
        <Route path='record' component={RecordContainer} onEnter={checkAuth} />
        <Route path='map' component={MapVisContainer} onEnter={checkAuth} />
        <Route path='roads/:roadId' component={RoadVisContainer} onEnter={checkAuth} />
        <Route path='user/:uid' onEnter={checkAuth} >
          <Route path='calibrate' component={CalibrateContainer} onEnter={checkAuth} />
          <Route path='respond' component={RespondContainer} onEnter={checkAuth}/>
          <IndexRoute component={UserContainer} onEnter={checkAuth} />
        </Route>
        <Route path='proposals' component={ProposalListContainer} onEnter={checkAuth}/>
        <Route path='proposals/:proposalId' component={ProposalContainer} onEnter={checkAuth} />
        <Route path='signin' component={AuthContainer} onEnter={checkAuth}/>
        <Route path='logout' component={LogoutContainer} />
        <Route path='clear' component={ClearContainer} />
        <Route path='tests' onEnter={checkAuth} >
          <Route path='playSound' component={PlaySoundContainer} onEnter={checkAuth}/>
          <Route path='layout' component={LayoutContainer} onEnter={checkAuth}/>
          <Route path='recordSound' component={RecordSoundContainer}/>
        </Route>
        <IndexRoute component={HomeContainer} onEnter={checkAuth}/>
      </Route>
    </Router>
  );
}
