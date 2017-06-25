// @flow
import React from 'react';
import { largeButton, callibrateContents } from './styles.css';
// import ToggleButton from 'react-toggle-button'

type Props = {
  isFetching: boolean,
  isCalibrating: boolean,
  toggleCalibration: Function,
  targetFrequency: number,
}

export default function Calibrate ({isFetching, isCalibrating, toggleCalibration, targetFrequency}: Props) {
  const buttonStyle = {
    backgroundColor: isCalibrating ? '#ff0000' : '#444444',
  };

  const status: string = isCalibrating ? 'calibrating' : `target frequency: ${targetFrequency}`;

  return (
    isFetching
      ? <div id='calibrate' className={callibrateContents} />
      : (<div id='calibrate' className={callibrateContents}>
        { status }
        <div className={largeButton} style={buttonStyle} onClick={toggleCalibration}>
          { isCalibrating === true
            ? 'stop calibration'
            : 'start calibration'
          }
        </div>
      </div>)
  );
}
