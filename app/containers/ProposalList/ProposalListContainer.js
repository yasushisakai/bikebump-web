// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ProposalList } from 'components';
import { Map } from 'immutable';

import { handleFetchingRoads } from 'modules/roads';
import { handleFetchingRoadProposals } from 'modules/roadProposals';

type Props = {
        roads: Map<any, any>;
        roadProposals: Map<any, any>;
        handleFetchingRoads: Function;
        handleFetchingRoadProposals: Function;
}

class ProposalListContainer extends React.Component<void, Props, void> {
    componentWillMount () {
        this.props.handleFetchingRoads();
        this.props.handleFetchingRoadProposals();
    }

    componentWillUpdate (nextProps: Props) {
        if (!nextProps.isFetching) {
            console.log('next props', nextProps.roadProposals.toJS());
        }
    }

    render () {
        return <ProposalList
            roads={this.props.roads}
            roadProposals={this.props.roadProposals.toJS()} />;
    }
}

function mapStateToProps ({roads, roadProposals}, props) {
    return {
        isFetching: roads.get('isFetching'),
        roadProposals,
        roads,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingRoads,
        handleFetchingRoadProposals,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalListContainer);
// export default ProposalListContainer;
