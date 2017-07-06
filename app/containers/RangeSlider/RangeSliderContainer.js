import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { RangeSlider } from '@blueprintjs/core';

import { setDomain } from 'modules/userProposals';

class RangeSliderContainer extends React.Component {
    state: {
        range: number[];
    }

    handleValueChange: Function;
    onRelease: Function;

    constructor (props) {
        super(props);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.onRelease = this.onRelease.bind(this);
        this.state = {
            range: [0, 1],
        };
    }

    handleValueChange (range: number[]) {
        this.setState({
            range,
        });
    }

    onRelease (range: number[]) {
        // console.log(range);
        this.props.setDomain({start: range[0], end: range[1]});
    }

    render () {
        return <RangeSlider
            min={0}
            max={1.0}
            stepSize={0.01}
            labelStepSize={0.2}
            onChange={this.handleValueChange}
            onRelease={this.onRelease}
            value={this.state.range}/>;
    }
}

function mapStateToProps (state, props) {
    return {};
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        setDomain,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RangeSliderContainer);
