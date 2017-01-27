import React, { PropTypes } from 'react'
import { mainButton, smallButton,  detailText } from './styles.css'
import { Map } from 'immutable'

import { recordContainer } from './styles.css'

Record.propTypes={
  isRecording : PropTypes.bool.isRequired,
  isFetchingLatLng : PropTypes.bool.isRequired,
  onRecordButtonClick: PropTypes.func.isRequired,
  onReportButtonClick: PropTypes.func.isRequired,
  location : PropTypes.instanceOf(Map)
}

export default function Record (props) {

  function onReportGood () {
    props.onReportButtonClick(0)
  }

  function onReportBad () {
    props.onReportButtonClick(1)
  }

  const buttonStyle = {
    backgroundColor : props.isRecording ? '#ff0000' : '#444444'
  }

  function buttonColor(color,float) {
    return {
      backgroundColor: color,
      float : float,
    }
  }

  return (
   <div className={recordContainer}>
    <div className={mainButton} style={buttonStyle} onClick={props.onRecordButtonClick}>
    </div>
    {props.isRecording === true && props.isFetchingLatLng === false
    ? (<div>
      <div className={smallButton} style={buttonColor('#0055ff','right')}onClick={onReportGood}></div>
      <div className={smallButton} style={buttonColor('#ff5500','left')}onClick={onReportBad}></div>
      </div>
      )
    : null
    }
    <div className={detailText}>
      {
      props.isRecording === true && props.isFetchingLatLng === false
        ?(`location: lat=${props.location.get('lat')}, lat=${props.location.get('lng')}`)
        :null
      }
    </div>
    </div>
  )
}