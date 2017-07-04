// @flow
import React from 'react';
import { Link } from 'react-router';
import { imgRoot } from 'config/constants';
import QuestionIcon from 'react-icons/lib/fa/question';
import {ProposalMapContainer} from 'containers';

import {
  proposalContainer,
  overlayInfo,
  userInfo,
  proposalBack,
  proposalMid,
  proposalFore,
  proposalInfo,
  patternTitle,
  smallMetaInfo,
  patternDetails,
  voteSelecter,
  option,
  optionText,
} from './styles.css';

type Props = {
    proposalId: string;
    patternId: string;
    userUnits: number;
    pattern: {
        image: string;
        title: string;
        description: string;
    };
    proposal: {
        currentUnits: number;
        maxUnits: number;
    }
}

export default function Proposal ({ proposalId, userUnits, patternId, pattern, proposal }: Props) {
  const imageURL = `${imgRoot}patternBackgrounds/${pattern.image}.jpg`;
  let backgroundImageStyle: CSSStyleDeclaration = new CSSStyleDeclaration();
  backgroundImageStyle.background = `url(${imageURL}) center`;
  backgroundImageStyle.backgroundSize = 'cover';

  return (
    <div className={proposalContainer}>
      <ProposalMapContainer roadId={8615571} domain={{start: 0.1, end: 0.6}}/>
      <div className={overlayInfo}>
        <div className={userInfo}>
          {`units left: ${userUnits}`}
        </div>
        <div className={proposalBack} style={backgroundImageStyle} >
          <div className={proposalMid}>
            <div className={proposalFore} >
              <div className={proposalInfo}>
                <div className={patternDetails}><Link to={`/details/${patternId}`}><QuestionIcon /></Link></div>
                <div className={patternTitle}>{`${pattern.title}`}</div>
                <div className={smallMetaInfo}>{`${pattern.description}`}</div>
                {`${proposal.currentUnits / proposal.maxUnits}`}
                {`${proposal.maxUnits}`}
              </div>
              <div className={voteSelecter}>
                <div className={option}><span className={optionText}>{`${0}`}</span></div>
                <div className={option}><span className={optionText}>{`${10}`}</span></div>
                <div className={option}><span className={optionText}>{`${20}`}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
