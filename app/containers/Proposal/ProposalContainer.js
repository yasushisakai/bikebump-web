// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { handleFetchingPatterns } from 'modules/patterns';
import { handleFetchingProposals } from 'modules/proposals';
import { handleFetchingUserProposals } from 'modules/userProposals';
import { Proposal } from 'components';

type Props = {
    uid: string;
    proposalId: string;
    proposals: Map<any, any>;
    patterns: Map<any, any>;
    userProposals: Map<any, any>;

    handleFetchingPatterns: Function;
    handleFetchingProposals: Function;
    handleFetchingUserProposals: Function;
}

class ProposalContainer extends React.Component<void, Props, void> {
    proposal: Object;
    pattern: Object;

    constructor (props:Props) {
        super(props);
        this.proposal = this.pattern = null;
    }

    componentDidMount () {
        this.props.handleFetchingPatterns();
        this.props.handleFetchingProposals();
        this.props.handleFetchingUserProposals(this.props.uid);
    }

    componentWillUpdate (nextProps: Props) {
        if (!nextProps.isFetching) {
            const proposal = nextProps.proposals.get(nextProps.proposalId);
            if (proposal) {
                this.proposal = proposal.toJS();
                const patternId = this.proposal.patternId;
                const pattern = nextProps.patterns.get(patternId);
                if (pattern) {
                    this.pattern = pattern.toJS();
                }
            }
        }
    }

    render () {
        if (!this.props.isFetching && this.proposal && this.pattern && this.props.userProposals) {
            // console.log(this.props.userProposals.toJS());
            console.log(this.props.userProposals.getIn([this.props.uid, 'units']));
            const {image, title, description} = this.pattern;
            const {currentUnits, maxUnits} = this.proposal;
            return <Proposal
                proposalId={this.props.proposalId}
                userUnits={this.props.userProposals.getIn([this.props.uid, 'units'])}
                pattern={{image, title, description}}
                proposal={{currentUnits, maxUnits}}/>;
        } else {
            return <div>{'loading'}</div>;
        }
    }
}

function mapStateToProps ({users, proposals, patterns, userProposals}, props) {
    return {
        uid: users.get('authedId'),
        isFetching: proposals.get('isFetching') || patterns.get('isFetching') || userProposals.get('isFetching'),
        proposalId: props.params.proposalId,
        proposals: proposals,
        patterns: patterns,
        userProposals: userProposals,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingProposals,
        handleFetchingPatterns,
        handleFetchingUserProposals,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalContainer);

// export default ProposalContainer;

