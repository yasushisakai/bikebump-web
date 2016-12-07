/**
 * bikebump
 * RingDetectionContainer
 * 12/2/16
 * by yasushisakai
 */

import React, {Component} from 'react';
import P5 from 'p5';

/**
 * RingDetectionContainer class
 */
export default class RingDetectionContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {};


        let audioContext = new window.AudioContext()


        // the thing to see the frequencies
        this.analyzer = audioContext.createAnalyser();
        this.analyzer.minDecibels = -90;
        this.analyzer.maxDecibels = -10;
        this.analyzer.smoothingTimeConstant = 0.85;
        this.analyzer.fftSize = 512;
        //this.analyzer.getByteFrequencyData.bind(this);

        this.highpassFilter = audioContext.createBiquadFilter();
        this.highpassFilter.type = 'highpass';
        this.highpassFilter.frequency.value = 1000;
        this.highpassFilter.Q.value = 15;

        this.peakingFilter = audioContext.createBiquadFilter();
        this.peakingFilter.type = 'peaking';
        this.peakingFilter.frequency.value = 3000;
        this.peakingFilter.gain.value = 5; //dB
        this.peakingFilter.Q.value = 15;


        this.bandpassFilter = audioContext.createBiquadFilter();
        this.bandpassFilter.type = 'bandpass';
        this.bandpassFilter.frequency.value = 3000;
        this.bandpassFilter.Q.value = 15; // which is the right value?

        // holds the actual frequency data
        this.dataArray = new Uint8Array(this.analyzer.frequencyBinCount); // half of fftSize

        // mic test
        navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

        if (navigator.getUserMedia) {

            navigator.getUserMedia(
                {audio: true},
                stream=> {
                    let source = audioContext.createMediaStreamSource(stream);
                    source.connect(this.peakingFilter);
                    this.highpassFilter.connect(this.highpassFilter);
                    this.peakingFilter.connect(this.bandpassFilter);
                    this.bandpassFilter.connect(this.analyzer);
                },
                error=> {
                    console.error(error);
                }
            )

        } else {
            console.error('getUserMedia inaccessible');
        }

        // octave frequencies
        this.a_indexies = [27.5, 55, 110, 220, 440, 880, 1760, 3520, 7040, 14080].map(v=> {
            return this.getIndexFromFrequency(v)
        });

        this.targetIndex = this.getIndexFromFrequency(3050);
        this.sketch = this.sketch.bind(this);



    }

    // getInitialState(){}
    // componentDidMount(){}
    // componentDidUpdate(){}
    // componentWillUnmount(){}

    getIndexFromFrequency(frequency) {
        let nyquist = 44100 / 2.0;
        let index = Math.round(frequency / nyquist * this.analyzer.frequencyBinCount);
        return index;
    }

    getFrequencyFromIndex(index) {
        return (index * (44100 / 2.0)) / this.analyzer.frequencyBinCount;
    }

    /**
     * sketch
     * this is the p5js chunk
     * @param p
     */
    sketch(p) {

        p.setup = ()=> {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.textAlign(p.CENTER);
            p.textSize(9);
            this.unitWidth = p.windowWidth / this.dataArray.length;
            this.unitHeight = p.windowHeight / 256;
        };

        p.draw = ()=> {
            p.background(250);



            this.analyzer.getByteFrequencyData(this.dataArray); // the meat!

            /**
             * threshold
             */
            let averageRangeRadius = 30;
            let average = this.dataArray
                    //.slice(this.targetIndex - averageRangeRadius, this.targetIndex + averageRangeRadius + 1)
                    .reduce((a, c)=> {
                        return a + c;
                    }) / (this.dataArray.length);

            let targetRange = 3;
            let targetValue = this.dataArray.slice(this.targetIndex-targetRange,this.targetIndex+targetRange+1).reduce((a,c)=>{return a+c})/(3*2+1);

            //console.log(targetValue);

            p.noFill();
            p.stroke(0,128,128);
            p.line(0, p.windowHeight - (average * this.unitHeight), p.windowWidth, p.windowHeight - (average * this.unitHeight));
            p.stroke(0,0,128);
            p.line(0, p.windowHeight - (targetValue * this.unitHeight), p.windowWidth, p.windowHeight - (targetValue * this.unitHeight));



            /**
             * Detecting the "Ring"
             */
            if (targetValue - average > 75) {
                console.log(targetValue - average);
                p.background(255, 0, 0);
            }


            p.fill(0);
            p.noStroke();
            this.dataArray.map((v, index)=> {
                    if (index % 50 == 0)
                        p.text(this.getFrequencyFromIndex(index).toFixed(2), index * this.unitWidth, p.windowHeight - 50);
                }
            );

            p.noFill();
            p.stroke(255, 0, 0);
            this.a_indexies.map(v=> {
                p.line(this.unitWidth * v, 0, this.unitWidth * v, p.windowHeight);
            });

            p.stroke(0, 0, 255);
            p.line(this.unitWidth * this.targetIndex, 0, this.unitWidth * this.targetIndex, p.windowHeight);



            // draw the frequencies
            p.stroke(20);
            p.beginShape();
            this.dataArray.map((v, index)=> {
                p.vertex(index * this.unitWidth, p.windowHeight - this.unitHeight * v);
            });
            p.endShape();

        };


        p.mouseMoved = ()=> {

        };

        p.mousePressed = ()=> {
            let frequencyIndex = p.mouseX/this.unitWidth;
            let frequency = this.getFrequencyFromIndex(frequencyIndex);
            console.log(frequency+', '+frequencyIndex);
        };

        p.windowResized = ()=> {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

    }


    render() {

        const root = document.getElementById('root');
        new P5(this.sketch, root);
        return null; // we have a p5js sketch (canvas element) inside div root.
    }
}

RingDetectionContainer.propTypes = {};

RingDetectionContainer.defaultProps = {};