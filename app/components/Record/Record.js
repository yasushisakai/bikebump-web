import React, { PropTypes } from 'react'
import {button} from './styles.css'
import { Map } from 'immutable'

Record.propTypes={
  isRecording : PropTypes.bool.isRequired,
  onRecordButtonClick: PropTypes.func.isRequired,
  location : PropTypes.instanceOf(Map)
}

let renderTimes = 0

export default function Record (props) {
  renderTimes ++
  return (
   <div>
    <div className={button} onClick={props.onRecordButtonClick}>
      {props.isRecording === true
        ?'stop recording'
        :'start recording'
      }
    </div>
    {props.isRecording === true
    ? (<div>
      <div className={button} onClick={()=>{console.log('good')}}>{'good'}</div>
      <div className={button} onClick={()=>{console.log('bad')}}>{'bad'}</div>
      </div>
      )
    : null
    }
    {`Record render Times: ${renderTimes}`}
    <div>
      {`location: lat=${props.location.get('lat')}, lat=${props.location.get('lng')}`}
    </div>
   </div>
  )
}