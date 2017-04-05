import React, { PropTypes } from 'react'

import { 
contents,
} from 'styles/styles.css'

import { 
  MapAndStreetViewContainer,
  SurveyContainer,
  } from 'containers'

import {
  info, 
  mapAndStreetView,
  question, 
  refreshQuestion,
  refreshButton,
} from './styles.css'

Respond.propTypes = {
  dingId: PropTypes.string,
  questionId:PropTypes.string,
  clickRefresh: PropTypes.func.isRequired,
  clickOption: PropTypes.func.isRequired,
}

export default function Respond (props) {
  const whichIds = `dingId: ${props.dingId}, questionId: ${props.questionId}`
  
  return (
    <div className={ contents }>
      <div className={ info }>
        { whichIds }
      </div>
      <div className={ mapAndStreetView }>
        <MapAndStreetViewContainer dingId={ props.dingId } />
      </div>
      <div className={ question }>
        <SurveyContainer questionId={ props.questionId } onClickOption={ props.clickOption }/>
      </div>
      <div className={ refreshQuestion }>
        <div className={ refreshButton } onClick={ props.clickRefresh }> refresh </div>
      </div>
    </div>
  )
}
