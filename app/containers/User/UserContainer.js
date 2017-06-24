import React, {PropTypes} from 'react';
import { User } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toJS } from 'immutable';

import * as userDingsActionCreators from 'modules/userDings';
import * as userVotesActionCreators from 'modules/userVotes';
import * as userResponsesActionCreators from 'modules/userResponses';

const UserContainer = React.createClass({
  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    authedId: PropTypes.string.isRequired,
    handleFetchingUserDings: PropTypes.func.isRequired,
    handleFetchingUserResponses: PropTypes.func.isRequired,
    handleFetchingUserVotes: PropTypes.func.isRequired,
    dingIds: PropTypes.object,
  },
  contextTypes: {
    router: PropTypes.object.isRequired,
  },
  componentDidMount () {
    if (this.context.router.params.uid !== this.props.authedId) { this.context.router.push('/signin'); }

    // fetch user stuff
    if (this.props.isAuthed === true) { // reload
      this.props.handleFetchingUserDings();
      this.props.handleFetchingUserVotes();
      this.props.handleFetchingUserResponses();
    }
  },
  render () {
    return this.props.isFetching === true
      ? null
      : (<User uid={this.props.authedId} dingIds={this.props.dingIds}/>);
  },
});

function mapStateToProps ({users, userDings, userVotes, userResponses}, props) {
  return {
    isFetching: users.get('isFetching') || userDings.get('isFetching') || userVotes.get('isFetching'),
    authedId: users.get('authedId'),
    isAuthed: users.get('isAuthed'),
    dingIds: userDings.get(props.routeParams.uid),
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...userDingsActionCreators,
    ...userVotesActionCreators,
    ...userResponsesActionCreators,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
