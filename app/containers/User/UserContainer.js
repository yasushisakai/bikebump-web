// @flow
import React, { PropTypes } from 'react';
import { User } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';

import * as userDingsActionCreators from 'modules/userDings';
import * as userVotesActionCreators from 'modules/userVotes';
import * as userResponsesActionCreators from 'modules/userResponses';

import { extractActionCreators } from 'helpers/utils';

import type { Ding } from 'types';

type Props = {
    isFetching: boolean;
    isAuthed: boolean;
    authedId: string;
    handleFetchingUserDings: Function;
    handleFetchingUserResponses: Function;
    handleFetchingUserVotes: Function;
    dingIds: {[string]: Ding};
  }

class UserContainer extends React.Component<void, Props, void> {
  constructor (props, context) {
    super(props);
    context.router;
  }

  componentDidMount () {
    if (this.context.router.params.uid !== this.props.authedId) { this.context.router.push('/signin'); }

    // fetch user stuff
    if (this.props.isAuthed === true) { // reload
      this.props.handleFetchingUserDings();
      this.props.handleFetchingUserVotes();
      this.props.handleFetchingUserResponses();
    }
  }

  render () {
    return this.props.isFetching === true
      ? null
      : (<User uid={this.props.authedId} dingIds={this.props.dingIds}/>);
  }
}

UserContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps ({users, userDings, userVotes, userResponses}, props) {
  return {
    isFetching: users.get('isFetching') || userDings.get('isFetching') || userVotes.get('isFetching'),
    authedId: users.get('authedId'),
    isAuthed: users.get('isAuthed'),
    dingIds: userDings.get(props.routeParams.uid),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    ...extractActionCreators(userDingsActionCreators),
    ...extractActionCreators(userVotesActionCreators),
    ...extractActionCreators(userResponsesActionCreators),
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
