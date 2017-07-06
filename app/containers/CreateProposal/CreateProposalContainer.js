// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { CreateProposal } from 'components';

type Props ={
    roadId: string;
};

class CreateProposalContainer extends React.Component<void, Props, void> {
    render () {
        return <CreateProposal roadId={this.props.roadId}/>;
    }
}

function mapStateToProps (state, props) {
    return {
        roadId: props.params.roadId,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProposalContainer);

