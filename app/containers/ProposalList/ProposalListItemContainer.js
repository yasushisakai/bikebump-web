// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { handleFetchingPatterns } from 'modules/patterns';
import { handleFetchingProposals } from 'modules/proposals';
import { handleFetchingUserProposals } from 'modules/userProposals';
import { ProposalListItem } from 'components';
import isEmpty from 'lodash/isEmpty';

type Props = {
    isFetching: boolean;
    proposalId: string;
    uid: string;
    roadId: string;
    proposals: any;
    patterns: any;
    userProposals: any;

    handleFetchingPatterns: Function;
    handleFetchingProposals: Function;
    handleFetchingUserProposals: Function;
}

class ProposalListItemContainer extends React.Component<void, Props, void> {
    // const patternId: string = '-KbMbV6KN6h0C3QDyoyI'; 
    pattern: ?Object;
    proposal: ?Object;
    myUnits: number;
    isMine: boolean;

    constructor (props) {
        super(props);
        this.pattern = null;
        this.proposal = null;
        this.myUnits = 0;
        this.isMine = false;
    }

    componentWillMount () {
        this.props.handleFetchingUserProposals(this.props.uid);
        this.props.handleFetchingPatterns();
        this.props.handleFetchingProposals();
    }

    componentWillUpdate (nextProps: Props) {
        const proposal = nextProps.proposals.get(nextProps.proposalId);
        if (proposal) {
            this.proposal = proposal.toJS();
        }

        if (this.proposal) {
            const pattern = nextProps.patterns.get(this.proposal.patternId);
            if (pattern) {
                this.pattern = pattern.toJS();
            }
        }

        this.myUnits = this.getUserUnits(nextProps);
        this.isMine = this.checkIfMine();
    }

    getUserUnits (props: Props) {
        // console.log(this.props.roadId, this.props.proposalId);

        const votes = props.userProposals.getIn(['votes', `${props.roadId}`]);
        if (votes) {
            const points = votes.get(props.proposalId);
            return points || 0;
        } else {
            return 0;
        }
    }

    checkIfMine () {
        const proposals = this.props.userProposals.getIn(['proposals', `${this.props.roadId}`]);
        if (proposals) {
            return proposals.includes(this.props.proposalId);
        } else {
            return false;
        }
    }

    render () {
        if (this.props.isFetching || !this.pattern || !this.proposal) {
            return <div>{'loading'}</div>;
        } else {
            return <ProposalListItem
                proposalId={this.props.proposalId}
                patternTitle={this.pattern.title}
                image={this.pattern.image}
                start={this.proposal.domain.start}
                end={this.proposal.domain.end}
                currentUnits={this.proposal.currentUnits}
                maxUnits={this.proposal.maxUnits}
                userUnits={this.myUnits}
                isMine={this.isMine}/>;
        }
    }
}

function mapStateToProps ({users, patterns, proposals, userProposals}, props) {
    return {
        isFetching:
        patterns.get('isFetching') ||
        proposals.get('isFetching') ||
        userProposals.get('isFetching'),
        uid: users.get('authedId'),
        proposalId: props.proposalId,
        roadId: props.roadId,
        proposals,
        patterns,
        userProposals,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingPatterns,
        handleFetchingUserProposals,
        handleFetchingProposals,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalListItemContainer);
