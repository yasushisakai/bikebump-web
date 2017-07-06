// @flow
import React from 'react';
import { Link } from 'react-router';
import { imgRoot } from 'config/constants';

import { entryBack, entryMid, entryFore, patternTitle, userUnits, smallMetaInfo } from './styles.css';

type Props = {
    patternTitle: string;
    image: string;
    domain: {
        start: number;
        end: number;
    };
    currentUnits: number;
    maxUnits: number;
    userUnits: number;
    proposalId: string; // link
};

export default function ProposalListItem (props: Props) {
    const imageURL: string = `${imgRoot}patternBackgrounds/${props.image}.jpg`;

    const style: Object = {};
    style.background = `url(${imageURL}) center`;
    style.backgroundSize = 'cover';
    const ratio: number = Math.floor(props.currentUnits / props.maxUnits * 100);
    return (
        <Link to={`/proposals/${props.proposalId}`} style={{textDecoration: 'none'}}>
            <div className={entryBack} style={style}>
                <div className={entryMid}>
                    <div className={entryFore}>
                        <div className={patternTitle}>{props.patternTitle}</div>

                        <div className={smallMetaInfo}>{`domain: ${props.domain.start}, ${props.domain.end}`}</div>
                        <div className={smallMetaInfo}>{`${ratio}% fulfilled`}</div>
                        <div className={userUnits}>{props.userUnits}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
// @flow
}
