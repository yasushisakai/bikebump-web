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

        this.analyzer = audioContext.createAnalyser();
        this.analyzer.minDecibels = -90;
        this.analyzer.maxDecibels = -10;
        this.analyzer.smoothingTimeConstant = 0.85;
        this.analyzer.fftSize = 512;
        //this.analyzer.getByteFrequencyData.bind(this);

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
                    source.connect(this.analyzer);
                },
                error=> {
                    console.error(error);
                }
            )

        } else {
            console.error('getUserMedia inaccessible');
        }

        this.a_indexies = [27.5, 55, 110, 220, 440, 880, 1760, 3520, 7040, 14080].map(v=> {
            return this.getIndexFromFrequency(v)
        });

        this.targetIndex = this.getIndexFromFrequency(3010);

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

    sketch(p) {

        p.setup = ()=> {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.textAlign(p.CENTER);
            p.textSize(9);
        };

        p.draw = ()=> {
            p.background(250);

            let unitWidth = p.windowWidth / this.dataArray.length;
            let unitHeight = p.windowHeight / 256;

            this.analyzer.getByteFrequencyData(this.dataArray); // the meat!

            let average = this.dataArray.reduce((a,c)=>{
                return a+c;
            })/this.analyzer.frequencyBinCount;

            p.noFill();
            p.stroke(0);
            p.line(0,p.windowHeight-(average*unitHeight),p.windowWidth,p.windowHeight-(average*unitHeight));

            if (this.dataArray[this.targetIndex] > average) {
                p.background(255, 0, 0);
            }

            p.line(
                0,
                p.windowHeight-(this.dataArray[this.targetIndex]*unitHeight),
                p.windowWidth,
                p.windowHeight-(this.dataArray[this.targetIndex]*unitHeight)
            );


            p.fill(0);
            p.noStroke();
            this.dataArray.map((v, index)=> {
                    if (index % 20 == 0)
                        p.text(this.getFrequencyFromIndex(index).toFixed(2), index * unitWidth, p.windowHeight - 50);
                }
            );

            p.noFill();
            p.stroke(255, 0, 0);
            this.a_indexies.map(v=> {
                p.line(unitWidth * v, 0, unitWidth * v, p.windowHeight);
            });

            p.stroke(0, 0, 255);
            p.line(unitWidth*this.targetIndex,0,unitWidth*this.targetIndex,p.windowHeight);


            p.stroke(20);
            p.beginShape();
            this.dataArray.map((v, index)=> {
                p.vertex(index * unitWidth, p.windowHeight - unitHeight * v);
            });
            p.endShape();

        };


        p.mouseMoved = ()=> {

        };

        p.mousePressed = ()=> {
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