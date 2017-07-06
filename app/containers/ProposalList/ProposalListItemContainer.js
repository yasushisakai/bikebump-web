// @flow
import React from 'react';
// import { bindActionCreators, type Dispatch } from 'redux';
// import { connect } from 'react-redux';

import { ProposalListItem } from 'components';

type Props = {
    proposalId: string;
}

class ProposalListItemContainer extends React.Component<void, Props, void> {
    // const patternId: string = '-KbMbV6KN6h0C3QDyoyI'; 

    render () {
        const roadId: number = 861557;

        const pattern = {
            description: 'apply green paint to both bicycle lanes.',
            image: 'green_paint',
            patternId: '-KbMbV6KN6h0C3QDyoyI',
            per: 'meters',
            title: 'Green Paint',
            units: 50,
        };

        const proposal = {
            currentUnits: 10,
            domain: { start: 0.1, end: 0.5 },
            maxUnits: 5000,
            patternId: '-KbMbV6KN6h0C3QDyoyI',
            roadId: 8615571,
        };

        const userProposal = {
            proposals: {
                '861557': {
                    'anotherProposalId': 20,
                    'sampleProposalId': 10,
                },
            },
            units: 70,
        };

        return <ProposalListItem
            proposalId={this.props.proposalId}
            patternTitle={pattern.title}
            image={pattern.image}
            domain={proposal.domain}
            currentUnits={proposal.currentUnits}
            maxUnits={proposal.maxUnits}
            userUnits={userProposal.proposals[roadId][this.props.proposalId]}/>;
    }
}

/*
function mapStateToProps (state, props) {
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
  
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalListItemContainer.js);
*/
export default ProposalListItemContainer;
