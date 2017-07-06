// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';

import { ProposalList } from 'components';
import { Map, fromJS } from 'immutable';

import { handleFetchingRoads } from 'modules/roads';

class ProposalListContainer extends React.Component {
    componentWillMount () {
        this.props.handleFetchingRoads();
    }

    props: {
        roads: Map<any, any>;
        unitsLeft: number;
        roadProposals: Map<any, any>;
        handleFetchingRoads: Function;
    }

    render () {
        return <ProposalList
            unitsLeft={this.props.unitsLeft}
            roads={this.props.roads}
            roadProposals={this.props.roadProposals.toJS()} />;
    }
}

function mapStateToProps (state, props) {
    /*
  const proposals = new Map({
    sampleProposalId: {
      currentUnits: 10,
      domain: { start: 0.1, end: 0.5 },
      maxUnits: 5000,
      patternId: '-KbMbV6KN6h0C3QDyoyI',
      roadId: 8615571,
    },
    anotherProposalId: {
      currentUnits: 20,
      domain: { start: 0.6, end: 1.0 },
      maxUnits: 3000,
      patternId: '-KdTv3G639n14nloOkd5',
      roadId: 8615571,
    },
  });

  const patterns = new Map({
    '-KbMbV6KN6h0C3QDyoyI': {
      description: 'apply green paint to both bicycle lanes.',
      image: 'green_paint',
      patternId: '-KbMbV6KN6h0C3QDyoyI',
      per: 'meters',
      title: 'Green Paint',
      units: 50,
    },
    '-KdTuaiUjQyK1kN4zkuI': {
      description: 'Make bike box at intersection',
      image: 'bike_box',
      patternId: '-KdTuaiUjQyK1kN4zkuI',
      per: 'road',
      title: 'Bike Box',
      units: 200,
    },
    '-KdTv3G639n14nloOkd5': {
      description: 'Add Studs between car and bike lane.',
      image: 'studs',
      patternId: '-KdTv3G639n14nloOkd5',
      per: 'meters',
      title: 'Studs',
      units: 250,
    },
  });
  */

    const userProposals = fromJS({
        proposals: {
            '861557': {
                anotherProposalId: 20,
                sampleProposalId: 10,
            },
        },
        units: 70,
    });

    const roadProposals = fromJS({
        '8615571': [
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
        ],
        '12116724': [
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
            'sampleProposalId',
        ],
    });

    console.log(userProposals.get('units'));

    return {
    // proposals,
        unitsLeft: userProposals.get('units'),
        // patterns,
        roadProposals,
        roads: state.roads,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingRoads,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalListContainer);
// export default ProposalListContainer;
