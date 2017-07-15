// @flow
import React from 'react';
import { black, red, white } from 'config/constants';
import {
    calibrateContainer,
    header,
    instructions,
    calibrateSketch,
    calibrateResult,
    button,
} from './styles.css';
// import ToggleButton from 'react-toggle-button'

type Props = {
  isFetching: boolean,
  isCalibrating: boolean,
  toggleCalibration: Function,
  targetFrequency: number,
}

export default function Calibrate ({isFetching, isCalibrating, toggleCalibration, targetFrequency}: Props) {
    const buttonStyle = {
        backgroundColor: isCalibrating ? red : white,
        color: isCalibrating ? white : black,
    };

    const status: string = isCalibrating ? 'calibrating' : `frequency: ${Math.floor(targetFrequency)}`;

    return (
        isFetching
            ? <div id='calibrate' className={calibrateContainer} > {'loading...'} </div>
            : (<div className={calibrateContainer}>
                <div className={header}>{'Calibrate to bell'}</div>
                <div className={instructions}>{'push "Start Calibrating and ring your bicycle bell"'}</div>
                <div className={calibrateSketch}>
                    <canvas id='calibrate'/>
                </div>
                <div className={calibrateResult}> { status } </div>
                <div className={button}>
                    <div className={`pt-button pt-large ${button}`} style={buttonStyle} onClick={toggleCalibration}>
                        { isCalibrating === true
                            ? 'save frequency'
                            : 'start calibration'
                        }
                    </div>
                </div>
            </div>)
    );
}
