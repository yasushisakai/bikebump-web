// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';
import { firebaseAuth } from 'config/constants';
import { formatUser } from 'helpers/utils';
import { body, container } from 'styles/styles.css'; // eslint-disable-line no-unused-vars
import { Navigation } from 'components';
import * as usersActionCreators from 'modules/users';

class MainContainer extends React.Component {
  componentDidMount () {
    this.props.fetchingUser();
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        // user is signed in
        const userInfo = formatUser(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid
        );
        this.props.fetchingUserSuccess(user.uid, userInfo, Date.now());
        this.props.authUser(user.uid);
      } else {
        // user is not signed
        this.props.removeFetchingUser();
      }
    });
  }

  shouldComponentUpdate (nextProps) {
    return true;
  }

  props: {
    isFetching: boolean,
    isRecording: boolean,
    error: string,
    isAuthed: boolean,
    authedId: string,
    children: React.Component<*>,

  fetchingUser: Function,
  fetchingUserSuccess: Function,
  authUser: Function,
  removeFetchingUser: Function,
}

  render () {
    return this.props.isFetching
      ? <div> {'loading user...'} </div>
      : (
        <div className={container}>
          <Navigation
            isAuthed={this.props.isAuthed}
            isRecording={this.props.isRecording}
            authedId={this.props.authedId}/>
          {this.props.children}
        </div>
      );
  }
}

function mapStateToProps ({ users, record }) {
  return {
    isFetching: users.get('isFetching'),
    isRecording: record.get('isRecording'),
    error: users.get('error'),
    isAuthed: users.get('isAuthed'),
    authedId: users.get('authedId'),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    ...usersActionCreators,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContainer);
