// @flow
import React from 'react';
import { largeButton, callibrateContents } from './styles.css';
// import ToggleButton from 'react-toggle-button'

type Props = {
  isFetching: boolean;
  isCalibrating?: boolean;
  toggleCalibration?: () => void;
  targetFrequency?: number;
}

export default function Calibrate ({isFetching, isCalibrating, toggleCalibration, targetFrequency}: Props) {
  const buttonStyle = {
    backgroundColor: isCalibrating ? '#ff0000' : '#444444',
  };

  return (
    isFetching
      ? <div id='calibrate' className={callibrateContents} />
      : (<div id='calibrate' className={callibrateContents}>
        { isCalibrating === true
          ? 'calibrating...'
          : `target bell frequency: ${targetFrequency}`
        }
        <div className={largeButton} style={buttonStyle} onClick={toggleCalibration}>
          { isCalibrating === true
            ? 'stop calibration'
            : 'start calibration'
          }
        </div>
      </div>)
  );
}
