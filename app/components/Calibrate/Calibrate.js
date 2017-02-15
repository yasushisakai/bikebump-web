import React, { PropTypes } from 'react'
import { largeButton, callibrateContents } from './styles.css'

Calibrate.propTypes = {
  isFetching : PropTypes.bool.isRequired,
  // isCalibrating: PropTypes.bool.isRequired,
  // toggleCalibration: PropTypes.func.isRequired,
  //targetFrequency : PropTypes.number.isRequired,
}

export default function Calibrate (props) {
 const buttonStyle = {
    backgroundColor : props.isCalibrating ? '#ff0000' : '#444444'
  }

  return (
    props.isFetching 
    ? <div id='calibrate' className={callibrateContents}> </div> 
    :(<div id='calibrate' className={callibrateContents}>
    { props.isCalibrating === true 
      ? 'calibrating...'
      : `target bell frequency: ${props.targetFrequency}`
    }
      <div className={ largeButton } style={buttonStyle} onClick={props.toggleCalibration}>
        { props.isCalibrating === true
          ? 'stop calibration'
          : 'start calibration'
        }
      </div>
    </div>)
  )
}