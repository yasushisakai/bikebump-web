// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Proposal } from 'components';

class ProposalContainer extends React.Component {
    render () {
        const proposalId = 'sampleProposalId';
        return <Proposal
            proposalId={proposalId}
            userUnits={70}
            pattern={{image: 'bike_box', title: 'Pattern Title', description: 'hellow'}}
            proposal={{currentUnits: 20, maxUnits: 1000}}/>;
    }
}

// function mapStateToProps (state, props) {
// }

// function mapDispatchToProps (dispatch: Dispatch<*>) {
//   return bindActionCreators({
//   }, dispatch);
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ProposalContainer);

export default ProposalContainer;

