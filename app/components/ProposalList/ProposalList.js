// @flow
import React from 'react';
import { ProposalListItemContainer } from 'containers';
import { Map } from 'immutable';
import { proposalListContainer, listContainer, roadCategory, userUnits } from './styles.css';
import type { Road } from 'types';

type Props = {
    roadProposals: any;
    roads: Map<any, any>;
    unitsLeft: string;
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

export default function ProposalList ({ roadProposals, roads, unitsLeft }: Props) {
  console.log(roadProposals);
  const contents = Object.keys(roadProposals).map((key) => (
    <RoadCategory key={`road-${key}`} roadId={key} roads={roads} >
      {roadProposals[key].map((proposalId, index) => (
        <ProposalListItemContainer key={`${index}-${proposalId}`} proposalId={proposalId}/>)
      )}
    </RoadCategory>));
  //   const proposalList = proposalIds.map((proposalId, index) => {
  //     return (
  //       <ProposalListItemContainer proposalId={proposalId} key={`proposal-${index}`}/>
  //     );
  //   });
  return (
    <div className={proposalListContainer}>
      <div>
        <div className={roadCategory}>{`Proposal List`}</div>
        <div className={userUnits}>{`units left: `}{unitsLeft}</div>
      </div>
      <div className={listContainer}>
        {contents}
      </div>
    </div>
  );
}
