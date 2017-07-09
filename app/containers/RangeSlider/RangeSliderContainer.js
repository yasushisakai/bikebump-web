import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { RangeSlider } from '@blueprintjs/core';

import { setDomain } from 'modules/userProposals';

type Props = {
    disabled: boolean;
    setDomain: Function;
    onChangeSlider: Function;
}

class RangeSliderContainer extends React.Component<void, Props, void> {
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
            range: [0, 10],
        };
    }

    handleValueChange (range: number[]) {
        this.setState({
            range,
        });
    }

    onRelease (range: number[]) {
        // console.log(range);
        const domain = {start: range[0] * 0.1, end: range[1] * 0.1};
        this.props.setDomain(domain);
        this.props.onChangeSlider(domain);
    }

    render () {
        return <RangeSlider
            disabled={this.props.disabled}
            renderLabel={true}
            min={0}
            max={10}
            stepSize={0.1}
            labelPrecision={0}
            labelStepSize={10}
            onChange={this.handleValueChange}
            onRelease={this.onRelease}
            value={this.state.range}/>;
    }
}

function mapStateToProps (state, props) {
    return {
        disabled: state.userProposals.getIn(['create','sliderDisabled']),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        setDomain,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RangeSliderContainer);
