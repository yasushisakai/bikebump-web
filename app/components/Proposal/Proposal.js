// @flow
import React from 'react';
import { Link } from 'react-router';
import QuestionIcon from 'react-icons/lib/fa/question';
import { CoinProgress } from 'components';
import { ProposalMapContainer, BikeCoinBadgeContainer, ProposalOptionContainer } from 'containers';

import {
    proposalContainer,
    overlayInfo,
    proposalBack,
    proposalMid,
    proposalFore,
    proposalInfo,
    patternTitle,
    progressBar,
    patternDetails,
    voteSelecter,
    lengthInfo,
} from './styles.css';

import {
    imgRoot, white, black, red, orange, yellow,
} from 'config/constants';

type Props = {
    proposalId: string;
    patternId: string;
    userUnits: number;
    pattern: {
        image: string;
        title: string;
        description: string;
        per: string;
        units: number;
    };
    proposal: {
        currentUnits: number;
        maxUnits: number;
    };
    onClickOption: Function;
}

export default function Proposal ({ proposalId, userUnits, patternId, pattern, proposal, onClickOption }: Props) {
    const imageURL = `${imgRoot}patternBackgrounds/${pattern.image}.jpg`;

    const backgroundImage: {[attribute: string]: string} = {
        background: `url(${imageURL}) center`,
        backgroundSize: 'cover',
    };

    const proposalLength = pattern.per !== 'road' ? Math.floor(3.28084 * proposal.maxUnits / pattern.units): 0;

    const proposalLengthInfo = pattern.per === 'road' ? 'for this road is...' : `for ${proposalLength}ft is...`;

    return (
        <div className={proposalContainer}>
            <BikeCoinBadgeContainer />
            <ProposalMapContainer roadId={8615571} domain={{start: 0.1, end: 0.6}}/>
            <div className={overlayInfo}>
                <div className={proposalBack} style={backgroundImage} >
                    <div className={proposalMid}>
                        <div className={proposalFore} >
                            <div className={proposalInfo}>
                                <div className={patternDetails}><Link to={`/details/${patternId}`}><QuestionIcon /></Link></div>
                                <div className={patternTitle}>{`${pattern.title}`}</div>
                                <div className={lengthInfo}>{proposalLengthInfo}</div>
                            </div>
                            <div className={voteSelecter}>
                                <ProposalOptionContainer value={0} color={white} backgroundColor={black} id={proposalId} text={'not needed'}/>
                                <ProposalOptionContainer value={10} color={black} backgroundColor={yellow} id={proposalId} text={'good'}/>
                                <ProposalOptionContainer value={20} color={black} backgroundColor={orange} id={proposalId} text={'critical'}/>
                                <ProposalOptionContainer value={50} color={black} backgroundColor={red} id={proposalId} text={'must'}/>
                            </div>
                            <div className={progressBar}><CoinProgress currentPoints={proposal.currentUnits} maxPoints={proposal.maxUnits} showInfo={true}/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
