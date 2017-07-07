// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { handleFetchingPatterns } from 'modules/patterns';

import { CreatePanel } from 'components';

type Props = {
    roadId: string;
    patterns: Map<any, any>;
    handleFetchingPatterns: Function;
}

class CreatePanelContainer extends React.Component<void, Props, void> {
    constructor (props: Props) {
        super(props);

        this.optionsInfo = [];

        this.handleChangeSlider = this.handleChangeSlider.bind(this);
        this.handleSelectPattern = this.handleSelectPattern.bind(this);
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
    }

    optionsInfo: Array<Array<string>>;

    handleChangeSlider: Function;
    handleSelectPattern: Function;
    handleClickSubmit: Function;

    componentDidMount () {
        // console.log('hello');
        this.props.handleFetchingPatterns();
    }

    componentWillUpdate (nextProps:Props) {
        this.optionsInfo = Object.keys(nextProps.patterns.toJS())
            .filter((key) => key !== 'lastUpdated' && key !== 'error' && key !== 'isFetching')
            .map((key) => ([key, nextProps.patterns.toJS()[key].title]));
        
        console.log(this.optionsInfo);

    }

    handleChangeSlider () {
        console.log('handle Change Slider');
    }

    handleSelectPattern (obj) {
        console.log(obj.target.value);
        console.log('handle Select Pattern');
    }

    handleClickSubmit () {
        console.log('handle Click submit');
    }

    render () {
        return (
            <CreatePanel
                requiredUnits={3000}
                disabled={false}
                optionsInfo={this.optionsInfo}
                onSelectPattern={this.handleSelectPattern}
                onChangeSlider={this.handleChangeSlider}
                onClickSubmit={this.handleClickSubmit}/>
        );
    }
}

function mapStateToProps (state, props) {
    return {
        roadId: props.roadId,
        patterns: state.patterns,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingPatterns,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePanelContainer);
