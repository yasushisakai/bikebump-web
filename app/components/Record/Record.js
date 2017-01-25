import React, { PropTypes } from 'react'
import {button} from './styles.css'
import { Map } from 'immutable'

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

  return (
   <div>
    <div className={button} onClick={props.onRecordButtonClick}>
      {props.isRecording === true
        ?'stop recording'
        :'start recording'
      }
    </div>
    {props.isRecording === true && props.isFetchingLatLng === false
    ? (<div>
      <div className={button} onClick={onReportGood}>{'good'}</div>
      <div className={button} onClick={onReportBad}>{'bad'}</div>
      </div>
      )
    : null
    }
    <div>
      {
      props.isRecording === true && props.isFetchingLatLng === false
        ?(`location: lat=${props.location.get('lat')}, lat=${props.location.get('lng')}`)
        :null
      }
    </div>
   </div>
  )
}