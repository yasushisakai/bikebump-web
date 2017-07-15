// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import Pen, { type Point2D } from 'helpers/Pen';
import FrequencyGraph from 'helpers/FrequencyGraph';
import { fitCanvas, extractActionCreators, vibrate } from 'helpers/utils';
import { Record } from 'components';
import { Analyser, Recorder } from 'helpers/Sound';
import { AudioContext, updateCycleDuration, threshold, doubleDingDuration, bufferAveraging } from 'config/constants';
import * as userSettingsActionCreators from 'modules/userSettings';
import * as recordActionCreators from 'modules/record';
import * as dingsActionCreators from 'modules/dings';
import * as dingFeedActionCreators from 'modules/dingFeed';
import * as userDingActionCreators from 'modules/userDings';
import type { LatLng } from 'types';

class RecordContainer extends React.Component {
    constructor (props) {
        super(props);
        this.draw = this.draw.bind(this);
        this.setup = this.setup.bind(this);
        this.mouseMoved = this.mouseMoved.bind(this);
        this.updatePosition = this.updatePosition.bind(this);
        this.mousePressed = this.mousePressed.bind(this);
        this.resize = this.resize.bind(this);
        this.dataArrays = [];
    }

    componentDidMount () {
        // setting dom elements
        this.canvas = document.createElement('canvas');
        this.recordElement = ((document.getElementById('record'): any): HTMLElement);
        this.recordElement.appendChild(this.canvas);
        fitCanvas(this.canvas);

        // fetching data
        this.props.handleSetDingListener();
        this.props.handleFetchingUserSettings(this.props.authedId);
        this.props.handleFetchingUserDings(this.props.authedId);
        this.latLngInterval = null;

        this.pen = new Pen(this.canvas);
        // plot to html5 canvas (p5 replacement) this.pen = new Pen(this.canvas)

        // audio
        this.audioContext = new AudioContext();
        this.analyser = new Analyser(this.audioContext);
        this.analyser.setIsInFocus(true);

        // console.log(navigator.mediaDevices);
        // console.log(navigator.mediaDevices.getUserMedia);

        navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            .then((stream) => {
                let source = this.audioContext.createMediaStreamSource(stream);
                source.connect(this.analyser.input);
                this.analyser.connect();
                this.recorder = new Recorder(source, {recordDuration: 5000, cut: 1000});
                this.recorder.record();
            })
            .catch((error) => {
                console.error(error);
                this.props.handleChangeBellUse(this.props.authedId, false);
            });
        // } else {
        //     console.error('user get media error');
        //     // switch to button mode
        // }

        // canvas functions
        this.setup();
        this.draw(); // 'endless loop'
    }

    componentWillUnmount () {
        this.audioContext.close();
        window.cancelAnimationFrame(this.animation);

        if (this.latLngInterval !== null) {
            window.clearInterval(this.latLngInterval);
            this.latLngInterval = null;
        }

        // stop recording
        if (this.props.isRecording === true) {
            this.props.toggleRecording();
        }
    }

    // FIXME: fix any stuff
    recordElement: HTMLElement;
    canvas: HTMLCanvasElement;
    pen: Pen;
    frequencyGraph: FrequencyGraph;
    audioContext: any;
    analyser: any;
    recorder: any;
    animation: number;
    latLngInterval: ?number;
    binWidth: number;
    circleRadius: number;

    transitionParameter: number;
    transitionDirection: number;

    firstFlag: boolean;
    secondFlag: boolean;
    isDing: boolean;
    previousSpike: number;

    msStarted: number;
    singleCycleDuration: number;
    snakeLength: number;
    snakePointList: Array<Point2D>;
    detectionList: Array<Array<number>>;

    dataArrays: Uint8Array[];

    blob: Blob;

    draw: Function;
    setup: Function;
    mouseMoved: Function;
    updatePosition: Function;
    mousePressed: Function;
    resize: Function;

    props: {
        isFetching: bool;
        isAuthed: bool;
        authedId: string;
        isRecording: bool;
        isUploading: bool;
        isInside: bool;
        whichDing: string;
        latestLocation: LatLng;
        currentCommuteId: string;
        latestFetch: number;
        lastDetection: number;
        targetFrequency: number;
        targetDuration: number;
        targetSlope0: number;
        targetSlope1: number;
        detectionStatus: number;
        router: Object;

        handleSetDingListener: Function;
        handleFetchingUserSettings: Function;
        handleChangeBellUse: Function;
        handleFetchingUserDings: Function;
        toggleRecording: Function;
        handleFetchLatLng: Function;
        handleComplieDing: Function;
        uploadingClip: Function;
        handleUploadBlobWithValue: Function;
        handleDetection: Function;
    }

    pushDataArray (dataArray: Uint8Array) {
        if (this.dataArrays.length < bufferAveraging) {
            this.dataArrays.push(dataArray);
        } else {
            this.dataArrays.shift();
            this.dataArrays.push(dataArray);
        }

        const sum = this.dataArrays.reduce((currentTotal, array) => {
            return array.map((value, index) => (currentTotal[index] || 0) + value);
        }, []);

        return sum.map((value) => value / this.dataArrays.length);
    }

    setup () {
        this.dataArrays = [];
        const dataArray = this.pushDataArray(this.analyser.updateDataArray());
        this.binWidth = this.canvas.width / dataArray.length;
        this.circleRadius = this.canvas.width * 0.3;

        this.transitionParameter = 0.0;

        const freqStart: Point2D = {
            x: this.canvas.width * 0.5 - this.circleRadius,
            y: this.canvas.height * 0.5 + this.circleRadius + this.canvas.height * 0.07,
        };

        const freqSize: Point2D = {
            x: this.circleRadius * 2, // width
            y: this.canvas.height * 0.07,
        };

        this.frequencyGraph = new FrequencyGraph(this.pen, freqStart, freqSize);
        this.frequencyGraph.addLabel(2000, '2K');
        this.frequencyGraph.addLabel(3000, '3K');
        this.frequencyGraph.addLabel(4000, '4K');

        //
        // Detection
        //
        this.firstFlag = false;
        this.secondFlag = false;
        this.isDing = false;
        this.previousSpike = Date.now();
        this.detectionList = [];

        this.canvas.onclick = this.mousePressed;
        this.canvas.addEventListener('mousemove', this.mouseMoved);
        this.canvas.addEventListener('resize', this.resize);

        this.msStarted = 0;
        this.singleCycleDuration = 3 * 1000; // ms (1min)
        this.snakeLength = 1000;
        this.snakePointList = [];

        this.blob = new Blob();
    }

    draw () {
        if (this.props.targetFrequency === 9999) {
            this.props.router.push(`user/${this.props.authedId}/calibrate`);
        }

        this.animation = requestAnimationFrame(this.draw);
        if (this.props.isFetching) {
            return;
        }

        this.pen.clear();

        if (this.props.isRecording) {
            const now = Date.now();
            const timeElapsed = now - this.msStarted;
            const cyclePosition = (timeElapsed % this.singleCycleDuration) / this.singleCycleDuration;
            const rad = (cyclePosition * 360) / 180 * Math.PI - 0.5 * Math.PI;

            const freqIndex: number = this.analyser.frequencyToIndex(this.props.targetFrequency);
            const slopes: Array<number> = this.analyser.getSlopes(freqIndex).map((v) => Math.max(0, v));

            if (this.detectionList.length === 1) {
                if (now - this.detectionList[0][0] > doubleDingDuration) {
                    // 
                    // SINGLE DING!!
                    //
                    this.props.handleComplieDing(this.detectionList[0][0], 0);
                    this.props.handleUploadBlobWithValue(this.blob, this.detectionList[0][0], 0);
                    this.detectionList = [];
                }
            }

            if (this.props.handleDetection(slopes)) {
                this.detectionList.push([now, rad]);
                
                if (this.detectionList.length !== 1) {
                    //
                    // DOUBLE DING!!
                    //
                    this.props.handleComplieDing(this.detectionList[0][0], 1);
                    this.props.handleUploadBlobWithValue(this.blob, this.detectionList[0][0], 1);
                    this.detectionList = [];
                } else {
                    // first ding
                    // we don't know whether it's a single or double ding
                    this.recorder.exportWAV((blob) => { this.blob = blob; });
                }
            }

            if (this.props.isInside) {
                const start = { x: 15, y: 15 };
                const size = { x: this.canvas.width - 30, y: this.canvas.height - 30 };
                this.pen.stroke(`rgb(${Pen.white})`);
                this.pen.drawRectangle(start, size);
            }

            // draw the polyline
            const dataArray = this.pushDataArray(this.analyser.updateDataArray());
            this.frequencyGraph.update(dataArray);
            this.frequencyGraph.draw(this.props.targetFrequency);

            this.pen.stroke(`rgba(${Pen.white}, 0.1)`);
            this.pen.ctx.setLineDash([4, 8]);
            const threshold0 = this.props.targetSlope0 * threshold;
            const threshold1 = this.props.targetSlope1 * threshold;
            this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius - (threshold0 * 0.5));
            this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius + (threshold1 * 0.5));

            this.pen.ctx.setLineDash([0]);

            const inner: Point2D = {
                x: Math.cos(rad) * (this.circleRadius - (slopes[0] * 0.5)) + this.pen.width * 0.5,
                y: Math.sin(rad) * (this.circleRadius - (slopes[0] * 0.5)) + this.pen.height * 0.5,
            };

            const outer: Point2D = {
                x: Math.cos(rad) * (this.circleRadius + (slopes[1] * 0.5)) + this.pen.width * 0.5,
                y: Math.sin(rad) * (this.circleRadius + (slopes[1] * 0.5)) + this.pen.height * 0.5,
            };

            switch (this.props.detectionStatus) {
            case 0: // initial
                this.pen.stroke(`rgb(${Pen.white})`);
                break;
            case 1: // waiting
                this.pen.stroke(`rgb(${Pen.yellow})`);
                break;
            case 2: // cooling
                this.pen.stroke(`rgb(${Pen.red})`);
                break;
            default:
                this.pen.stroke('rgb(255, 255, 255)');
            }
            this.pen.drawCircle(inner.x, inner.y, 2);
            this.pen.drawCircle(outer.x, outer.y, 2);
            this.pen.drawLinePoints(inner, outer);

            switch (this.props.detectionStatus) {
            case 0: // initial
                this.pen.stroke(`rgba(${Pen.white}, 0.05)`);
                break;
            case 1: // waiting
                this.pen.stroke(`rgba(${Pen.yellow}, 0.2)`);
                break;
            case 2: // cooling
                this.pen.stroke(`rgba(${Pen.red}, 0.2)`);
                break;
            default:
                this.pen.stroke(`rgba(${Pen.white}, 0.1)`);
            }
            // damp alpha :(
            // this.fill('rgba(0,0,0,0)');
            this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius - slopes[0]);
            this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius + slopes[1]);

            if (this.snakePointList.length !== 0) {
                this.snakePointList.splice(Math.floor(this.snakePointList.length / 2) + 1, 0, outer, inner);
            } else {
                this.snakePointList = [outer, inner];
            }

            if (this.snakePointList.length >= this.snakeLength) {
                this.snakePointList.pop();
                this.snakePointList.shift();
            }

            this.pen.noFill();
            this.pen.stroke('rgba(255, 255, 255, 0.3)');
            this.pen.drawPolyline(this.snakePointList);
            this.pen.ctx.stroke();

            this.pen.stroke('rgba(255, 0, 0, 0.3)');
            // this.pen.fill('red');
        } else {
            this.pen.stroke('white');
        }
        // this.pen.stroke('white');
        this.pen.fill('rgba(0.0, 0.0, 0.0, 0.0)');
        this.pen.drawCircle(this.canvas.width * 0.5, this.canvas.height * 0.5, this.circleRadius);
        this.pen.noStroke();
        // this.pen.fill('white');
        const status = this.props.isRecording ? 'push to stop' : 'push to start';
        this.pen.text(status, this.canvas.width * 0.5, this.canvas.height * 0.5 - this.circleRadius - 75);

        const now = Date.now();
        this.pen.stroke('rgba(255, 255, 255, 0.4)');
        this.detectionList.map((detection) => {
            if ((now - detection[0]) < this.singleCycleDuration) {
                const innerDetectionCoordinate = {
                    x: Math.cos(detection[1]) * (this.circleRadius * 0.85) + this.pen.width * 0.5,
                    y: Math.sin(detection[1]) * (this.circleRadius * 0.85) + this.pen.height * 0.5,
                };
                const outerDetectionCoordinate = {
                    x: Math.cos(detection[1]) * (this.circleRadius * 1.15) + this.pen.width * 0.5,
                    y: Math.sin(detection[1]) * (this.circleRadius * 1.15) + this.pen.height * 0.5,
                };
                this.pen.drawCircle(innerDetectionCoordinate.x, innerDetectionCoordinate.y, 4);
                this.pen.drawCircle(outerDetectionCoordinate.x, outerDetectionCoordinate.y, 4);
                this.pen.drawLinePoints(innerDetectionCoordinate, outerDetectionCoordinate);
            }
        });
    }

    updatePosition (commuteId: string) {
        this.props.handleFetchLatLng();
    }

    mousePressed (event: MouseEvent) {
        const distanceFromCenter = this.pen.distance(
            this.pen.mouseX,
            this.pen.mouseY,
            this.canvas.width / 2.0,
            this.canvas.height / 2.0
        );

        if (distanceFromCenter < this.circleRadius) {
            vibrate(50);
            this.props.toggleRecording()
                .then(response => {
                    if (response.isRecording) { // takes change immediately
                        const fetchFunc = this.updatePosition.bind(this, response.commuteId);
                        fetchFunc();
                        this.latLngInterval = window.setInterval(fetchFunc, updateCycleDuration);
                        this.snakePointList = [];
                        this.detectionList = [];
                        this.msStarted = Date.now();
                    } else {
                        if (this.latLngInterval !== null) {
                            window.clearInterval(this.latLngInterval);
                        }
                        this.latLngInterval = null;
                        // this.msStarted = 0;
                    }
                });
        }
    }

    mouseMoved (event: MouseEvent) {
        this.pen.updateMouse(event);
    }

    resize () {
        this.pen.resize();
    }

    render () {
        return (
            <Record />
        );
    }
}

function mapStateToProps (state) {
    const authedId = state.users.get('authedId');
    return {
        isAuthed: state.users.get('isAuthed'),
        authedId,
        isFetching:
        state.users.get('isFetching') ||
        state.userSettings.get('isFetching') ||
        state.dingFeed.get('isFetching'),
        isRecording: state.record.get('isRecording'),
        isInside: state.record.get('isInside'),
        whichDing: state.record.get('whichDing'),
        currentCommuteId: state.record.get('currentCommuteId'),
        isUploading: state.record.get('isUploading'),
        latestLocation: state.record.get('latestLocation').toJS(),
        latestFetch: state.record.get('latestFetch'),
        lastDetection: state.record.get('lastDetection'),
        detectionStatus: state.record.get('detectionStatus'),
        targetFrequency: state.userSettings.getIn([authedId, 'targetFrequency']),
        targetDuration: state.userSettings.getIn([authedId, 'maxDuration']),
        targetSlope0: state.userSettings.getIn([authedId, 'maxSlopes0']),
        targetSlope1: state.userSettings.getIn([authedId, 'maxSlopes0']),

    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        ...extractActionCreators(userSettingsActionCreators),
        ...extractActionCreators(recordActionCreators),
        ...extractActionCreators(dingsActionCreators),
        ...extractActionCreators(dingFeedActionCreators),
        ...extractActionCreators(userDingActionCreators),
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordContainer);
// export default RecordContainer
