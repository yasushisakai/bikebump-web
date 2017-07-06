// @flow
import React from 'react';
// import { bindActionCreators, type Dispatch } from 'redux';
// import { connect } from 'react-redux';

type Props = {
  isFetching: boolean;
  onClickOption: Function;
}

class RefreshQuestionContainer extends React.Component<void, Props, void> {
    componentDidMount () {
    }
    componentWillUpdate () {
    }
    render () {
        return null;
    }
}

/*
function mapStateToProps (state,props,) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(,dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(RefreshQuestionContainer)
*/

export default RefreshQuestionContainer;

