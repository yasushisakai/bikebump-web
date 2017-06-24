// @flow
import React from 'react';

import { contents } from 'styles/styles.css';

import {
  MapAndStreetViewContainer,
  SurveyContainer,
} from 'containers';

import {
  info,
  mapAndStreetView,
  question,
  refreshQuestion,
  refreshButton,
} from './styles.css';

type Props = {
  dingId: string;
  questionId: string;
  clickRefresh: () => void;
  clickOption: () => void;
}

export default function Respond ({dingId, questionId, clickRefresh, clickOption}: Props) {
  const whichIds = `dingId: ${dingId}, questionId: ${questionId}`;

  return (
    <div className={contents}>
      <div className={info}>
        { whichIds }
      </div>
      <div className={mapAndStreetView}>
        <MapAndStreetViewContainer dingId={dingId} />
      </div>
      <div className={question}>
        <SurveyContainer questionId={questionId} onClickOption={clickOption}/>
      </div>
      <div className={refreshQuestion}>
        <div className={refreshButton} onClick={clickRefresh}> {'refresh'} </div>
      </div>
    </div>
  );
}
