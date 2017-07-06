// @flow
import React from 'react';
import { Clear } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';
import * as userActionCreators from 'modules/users';

class ClearContainer extends React.Component {
  props: {
    isAuthed: boolean,
    isFetching: boolean,
    authedId: string,
    handleClearUser: Function,
  }

  handleClick () {
        this.props.handleClearUser();
    }

  render () {
        return (
            <Clear
                isFetching={this.props.isFetching}
                isAuthed={this.props.isAuthed}
                authedId={this.props.authedId}
                onClick={this.handleClick}/>
        );
    }
}

function mapStateToProps ({users}) {
    return {
        isAuthed: users.get('isAuthed'),
        authedId: users.get('authedId'),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators(userActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearContainer);
