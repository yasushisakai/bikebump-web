// @flow
import React from 'react';
import { ProposalListItemContainer, BikeCoinBadgeContainer } from 'containers';
import { Map } from 'immutable';
import { proposalListContainer, listContainer, roadCategory } from './styles.css';
import type { Road } from 'types';

type Props = {
    roadProposals: Object;
    roadOrder: Array<string>;
    roads: Map<any, any>;
}

type RoadCategoryType = {
  roadId: string;
  roads: Map<string, Road>;
  children: React.Component<*>;
}

function RoadCategory ({roadId, roads, children}: RoadCategoryType) {
    const roadName: string = roads.getIn([roadId, 'properties', 'name'], `no name road: ${roadId}`);
    return (<div style={{width: '100%', height: '100%'}}>
        <div id={`road-${roadId}`} className={roadCategory}>{roadName}</div>
        { children }
    </div>);
}

export default function ProposalList ({ roadProposals, roads, roadOrder }: Props) {
    const contents = roadOrder
        .map((key) => (
            <RoadCategory key={`road-${key}`} roadId={key} roads={roads} >
                {Object.keys(roadProposals[key])
                    .sort((a, b) => roadProposals[key][b] - roadProposals[key][a])
                    .map((proposalId, index) => (
                        <ProposalListItemContainer
                            key={`${index}-${proposalId}`}
                            roadId={key}
                            proposalId={proposalId}/>)
                    )}
            </RoadCategory>));
    //   const proposalList = proposalIds.map((proposalId, index) => {
    //     return (
    //       <ProposalListItemContainer proposalId={proposalId} key={`proposal-${index}`}/>
    //     );
    //   });
    return (
        <div className={proposalListContainer}>
            <div style={{position: 'relative'}}>
                <BikeCoinBadgeContainer />
            </div>
            <div className={listContainer}>
                {contents}
            </div>
        </div>
    );
}
