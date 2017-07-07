// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ProposalList } from 'components';
import { Map, fromJS } from 'immutable';

import { handleFetchingRoads } from 'modules/roads';
import { handleFetchingRoadProposals } from 'modules/roadProposals';

type Props = {
        roads: Map<any, any>;
        unitsLeft: number;
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
    }

    render () {
        return <ProposalList
            unitsLeft={this.props.unitsLeft}
            roads={this.props.roads}
            roadProposals={this.props.roadProposals.toJS()} />;
    }
}

function mapStateToProps ({roads, roadProposals}, props) {

    const userProposals = fromJS({
        proposals: {
            '861557': {
                anotherProposalId: 20,
                sampleProposalId: 10,
            },
        },
        units: 70,
    });

    return {
        isFetching: roads.get('isFetching') || userProposals.get('isFetching'),
        unitsLeft: userProposals.get('units'),
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
