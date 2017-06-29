// @flow
import React from 'react';

import {
  MapAndStreetViewContainer,
  SurveyContainer,
} from 'containers';

import { zIndexContents, mapAndStreetView, survey } from './styles.css';

type Props = {
  dingId: string;
  questionId: string;
  clickRefresh: () => void;
  clickOption: () => void;
}

export default function Respond ({dingId, questionId, clickRefresh, clickOption}: Props) {
  // const whichIds = `dingId: ${dingId}, questionId: ${questionId}`;

  return (
    <div className={zIndexContents}>
      <div className={mapAndStreetView}>
        <MapAndStreetViewContainer dingId={dingId} />
      </div>
      <div className={survey}>
        <SurveyContainer questionId={questionId} onClickOption={clickOption} onClickRefresh={clickRefresh}/>
      </div>
    </div>
  );
}
