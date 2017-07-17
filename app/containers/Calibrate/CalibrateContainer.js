// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Calibrate } from 'components';
import { Map } from 'immutable';
import { fitCanvas } from 'helpers/utils';
import * as userSettingsActionCreators from 'modules/userSettings';
import { Analyser } from 'helpers/Sound';
import Pen from 'helpers/Pen';
import { updateUserSettings } from 'helpers/api';
import { AudioContext, threshold, red, yellow, white, bufferAveraging } from 'config/constants';

type Props = {
    uid: string;
    isFetching: boolean;
    isCalibrating: boolean;
    noSettings: boolean;
    settings: any;
    enableRingBellMode: Function;
    disableRingBellMode: Function;
    handleFetchingUserSettings: Function;
    handleUpdateTargetFrequency: Function;
    toggleCalibration: Function;
};

class CalibrateContainer extends React.Component<void, Props, void> {
    constructor (props) {
        super(props);

        this.handleToggleCalibration = this.handleToggleCalibration.bind(this);
        this.toggleRingBell = this.toggleRingBell.bind(this);
        this.setup = this.setup.bind(this);
        this.draw = this.draw.bind(this);

        this.dataArrays = [];
    }
    componentDidMount () {
        this.canvas = ((document.getElementById('calibrate'): any): HTMLCanvasElement);
        // this.calibrateElement.appendChild(this.canvas);
        fitCanvas(this.canvas);
        this.pen = new Pen(this.canvas);
        if (this.props.noSettings) {
            this.props.handleFetchingUserSettings(this.props.uid);
        }

        this.maxSlopes = [0, 0];

        this.audioContext = new AudioContext();
        this.analyser = new Analyser(this.audioContext);
        this.analyser.setIsInFocus(true);
        // this sets will splice the raw data
        // into a specific range to 2k - 4k

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                const source = this.audioContext.createMediaStreamSource(stream);
                window.horrible_hack_for_mozilla = source;
                source.connect(this.analyser.input);
                this.analyser.connect();
            })
            .catch((error) => {
                console.error('user media error');
                console.error(error);
                // disable microphone
            });

        this.setup();
        this.draw();
    }

    componentWillUnmount () {
        this.props.disableRingBellMode(this.props.uid);
        if (this.maxDuration > 100 && this.props.isCalibrating) {
            this.props.handleUpdateTargetFrequency(
                this.props.uid,
                this.targetFrequency,
                this.maxSlopes,
                this.maxDuration,
            );
        }
        this.audioContext.close();
        window.cancelAnimationFrame(this.animation);
    }

    // FIXME: clear any types up
    calibrateElement: HTMLElement;
    canvas: HTMLCanvasElement;
    pen: any;
    slopes: Array<number>;
    maxSlopes: Array<number>;
    audioContext: any;
    analyser: any;
    animation: ?number;
    targetFrequency: number;
    binWidth: number;
    dataArrays: Uint8Array[];

    peakIndex: number;
    isTempPeak: boolean;
    peakTimeStamp: number;
    maxDuration: number;

    handleToggleCalibration: Function;
    toggleRingBell: Function;
    setup: Function;
    draw: Function;

    handleToggleCalibration () {
        this.props.toggleCalibration();
        if (!this.props.isCalibrating) {
            this.slopes = [0, 0]; // reset slopes
            this.maxSlopes = this.slopes;
            this.peakIndex = 0;
            this.isTempPeak = false;
            this.maxDuration = 0;
        } else {
            if (this.maxDuration > 100) {
                this.props.handleUpdateTargetFrequency(
                    this.props.uid,
                    this.targetFrequency,
                    this.maxSlopes,
                    this.maxDuration
                );
            }
        }
    }

    toggleRingBell (value: boolean) {
        if (value) {
            this.props.disableRingBellMode(this.props.uid);
        } else {
            this.props.enableRingBellMode(this.props.uid);
        }

        updateUserSettings(this.props.uid, 'useRingBell', !value);
    }

    pushDataArray (dataArray: Uint8Array) {
        if (this.dataArrays.length < bufferAveraging) {
            this.dataArrays.push(dataArray);
        } else {
            this.dataArrays.shift();
            this.dataArrays.push(dataArray);
        }

        let sumArray = [];

        for (let i = 0; i < this.dataArrays.length; i++) {
            for (let j = 0; j < this.dataArrays[0].length; j++) {
                const current = sumArray[j] || 0;
                sumArray[j] = current + this.dataArrays[i][j];
            }
        }

        return sumArray.map((value) => value / this.dataArrays.length);
    }

    //
    // p5.js functions
    //

    setup () {
        const dataArray = this.pushDataArray(this.analyser.updateDataArray());
        this.binWidth = this.canvas.width / dataArray.length;
        this.peakIndex = 0;
        this.maxDuration = 0;
        this.peakIndex = Date.now();
    }

    draw () {
        this.animation = window.requestAnimationFrame(this.draw);
        this.pen.clear();

        // update dataArray
        const dataArray = this.pushDataArray(this.analyser.updateDataArray());

        console.log(dataArray);

        // draw polyline
        this.pen.stroke(white);
        this.pen.ctx.beginPath();
        dataArray.map((bin, index) => {
            const x = index * this.binWidth;
            const y = (this.canvas.height) * (1 - bin / 256);
            this.pen.ctx.lineTo(x, y);
        });
        this.pen.ctx.stroke();

        // draw peak
        if (this.props.isCalibrating) {
            const newPeakIndex = this.analyser.getPeakIndex();
            const tempSlope = this.analyser.getSlopes(newPeakIndex, 2, dataArray);
            if ((this.maxSlopes[0] * threshold > tempSlope[0] || this.maxSlopes[1] * threshold > tempSlope[1]) && this.isTempPeak) {
                this.isTempPeak = false;
                this.maxDuration = Date.now() - this.peakTimeStamp;
                console.log(this.maxDuration);
            }
            this.pen.stroke(yellow);
            this.pen.drawVerticalAxis(newPeakIndex * this.binWidth, this.canvas.height);

            if (tempSlope[0] > this.maxSlopes[0] && tempSlope[1] > this.maxSlopes[1]) {
                this.isTempPeak = true;
                this.peakIndex = newPeakIndex;
                this.peakTimeStamp = Date.now();
                this.maxSlopes = tempSlope;
                this.targetFrequency = this.analyser.indexToFrequency(this.peakIndex);
            }
        }

        // draw current frequency setting
        const currentFreqIndex = this.analyser.frequencyToIndex(this.targetFrequency);
        this.pen.stroke(red);
        this.pen.drawVerticalAxis(currentFreqIndex * this.binWidth, this.canvas.height);

        this.pen.fill(white);
        this.pen.noStroke();
        this.pen.ctx.fillText(
            `${Math.floor(this.targetFrequency)} Hz`,
            currentFreqIndex * this.binWidth,
            this.canvas.height * 0.1
        );
        const duration = this.isTempPeak ? Date.now() - this.peakTimeStamp : this.maxDuration;

        this.pen.ctx.fillText(
            `${Math.floor(duration)} ms`,
            currentFreqIndex * this.binWidth,
            this.canvas.height * 0.1 + 20,
        );
    }

    render () {
        return (
            <Calibrate
                isFetching={this.props.isFetching}
                isCalibrating={this.props.isCalibrating}
                toggleCalibration={this.handleToggleCalibration}
                targetFrequency={this.props.settings.get('targetFrequency')}
                isRingBellEnabled={this.props.settings.get('useRingBells')}
                toggleRingBell={this.toggleRingBell} />
        );
    }
}

function mapStateToProps (state, props) {
    const uid: string = props.params.uid;
    return {
        uid,
        isCalibrating: state.userSettings.get('isCalibrating'),
        // isRingBellEnabled : state.userSettings.getIn([uid,'useRingBells']),
        isFetching: state.users.get('isFetching') || state.userSettings.get('isFetching') || !state.users.get('isAuthed'),
        noSettings: !state.userSettings.get(uid),
        settings: state.userSettings.get(uid) || new Map(),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators(userSettingsActionCreators, dispatch);
}

export default connect(mapStateToProps,
    mapDispatchToProps)(CalibrateContainer);
