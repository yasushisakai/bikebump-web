// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { CreatePanel } from 'components';

type Props = {
    roadId: string;
}

class CreatePanelContainer extends React.Component<void, Props, void> {
    constructor (props: Props) {
        super(props);

        this.handleChangeSlider = this.handleChangeSlider.bind(this);
        this.handleSelectPattern = this.handleSelectPattern.bind(this);
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
    }

    handleChangeSlider: Function;
    handleSelectPattern: Function;
    handleClickSubmit: Function;

    handleChangeSlider () {
        console.log('handle Change Slider');
    }

    handleSelectPattern () {
        console.log('handle Select Pattern');
    }

    handleClickSubmit () {
        console.log('handle Click submit');
    }

    render () {
        return (
            <CreatePanel
                onSelectPattern={this.handleSelectPattern}
                onChangeSlider={this.handleChangeSlider}
                onClickSubmit={this.handleClickSubmit}/>
        );
    }
}

/*
function mapStateToProps (state, props) {
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
  
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)( CreatePanelContainer);
*/
export default (CreatePanelContainer);
