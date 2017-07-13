// @flow
import React, { PropTypes } from 'react';
import { User } from 'components';
import { connect } from 'react-redux';
import { bindActionCreators, type Dispatch } from 'redux';

import { handleFetchingUserDings } from 'modules/userDings';
import { handleFetchingUserResponses } from 'modules/userResponses';
import { handleFetchingUserProposals } from 'modules/userProposals';
import { handleFetchingRankings } from 'modules/rankings';

import type { Ding } from 'types';

type Props = {
    uid: string;
    isFetching: boolean;
    isAuthed: boolean;
    authedId: string;
    handleFetchingUserDings: Function;
    handleFetchingUserResponses: Function;
    handleFetchingUserProposals: Function;
    handleFetchingRankings: Function;
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
            this.props.handleFetchingUserProposals(this.props.uid);
            this.props.handleFetchingUserResponses();
            this.props.handleFetchingRankings(this.props.uid);
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

function mapStateToProps ({users, userDings, userProposals, userResponses, rankings}, props) {
    return {
        uid: users.get('authedId'),
        isFetching: users.get('isFetching') ||
        userDings.get('isFetching') ||
        userProposals.get('isFetching') ||
        rankings.get('isFetching'),
        authedId: users.get('authedId'),
        isAuthed: users.get('isAuthed'),
        dingIds: userDings.get(props.routeParams.uid),
        dingRank: rankings.get('dingRanking'),
        responseRanking: rankings.get('responseRanking'),
        proposalRanking: rankings.get('proposalRanking'),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingUserDings,
        handleFetchingUserProposals,
        handleFetchingUserResponses,
        handleFetchingRankings,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
