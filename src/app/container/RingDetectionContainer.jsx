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
    }

    // getInitialState(){}
    // componentDidMount(){}
    // componentDidUpdate(){}
    // componentWillUnmount(){}


    sketch(p){



    }

    render() {

        const root = document.getElementById('root');
        new P5(this.sketch,root);
        return null; // we have a p5js sketch (canvas element) inside div root.
    }
}

RingDetectionContainer.propTypes = {};

RingDetectionContainer.defaultProps = {};