// @flow
import React, { PropTypes } from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Logout } from 'components';
import * as userActionCreators from 'modules/users';

class LogoutContainer extends React.Component {
  contextTypes: {
    router: PropTypes.object.isRequired,
  }

  componentDidMount () {
    this.props.handleUserLogout();
  }

  props: {
    isAuthed: boolean,
    handleUserLogout: Function,
  }

  render () {
    return (
      <Logout isAuthed={this.props.isAuthed} />
    );
  }
}

function mapStateToProps (state) {
  return {
    isAuthed: state.users.get('isAuthed'),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators(userActionCreators, dispatch);
}

export default connect(mapStateToProps,
  mapDispatchToProps)(LogoutContainer);
