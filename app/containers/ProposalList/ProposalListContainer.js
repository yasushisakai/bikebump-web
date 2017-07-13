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

function compareRoadTotalPointGain (keya:number, keyb: number): number {

}

class ProposalListContainer extends React.Component<void, Props, void> {
    constructor (props) {
        super(props);
        this.roadOrder = [];
    }

    roadOrder: Array<number>;

    componentWillMount () {
        this.props.handleFetchingRoads();
        this.props.handleFetchingRoadProposals();
    }

    sortRoadOrder (roadProposals: Object) {
        return Object.keys(roadProposals)
            .filter((key) => key !== 'isFetching' && key !== 'lastUpdated' && key !== 'error')
            .sort((keyA: string, keyB: string) => {
                const totalA = Object.keys(roadProposals[keyA]).reduce((prev, curr) => prev + roadProposals[keyA][curr], 0);
                const totalB = Object.keys(roadProposals[keyB]).reduce((prev, curr) => prev + roadProposals[keyB][curr], 0);
                return totalB - totalA;
            });
    }

    render () {
        const roadProposals = this.props.roadProposals.toJS();
        return <ProposalList
            roads={this.props.roads}
            roadProposals={roadProposals}
            roadOrder={this.sortRoadOrder(roadProposals)}/>;
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
