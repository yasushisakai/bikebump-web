// @flow
import React from 'react';
import { Link } from 'react-router';
import { imgRoot } from 'config/constants';
import ChildIcon from 'react-icons/lib/fa/child';

import { disabled, entryBack, entryMid, entryFore, patternTitle, userUnits, smallMetaInfo } from './styles.css';

type Props = {
    patternTitle: string;
    image: string;
    start: number;
    end: number;
    isMine: boolean;
    currentUnits: number;
    maxUnits: number;
    userUnits: number;
    proposalId: string; // link
    isMine: boolean;
};

export default function ProposalListItem (props: Props) {
    const imageURL: string = `${imgRoot}patternBackgrounds/${props.image}.jpg`;

    const style: Object = {};
    style.background = `url(${imageURL}) center`;
    style.backgroundSize = 'cover';
    const ratio: number = Math.floor(props.currentUnits / props.maxUnits * 100);
    return (
        <Link to={`/proposals/${props.proposalId}`} className={props.isMine ? disabled : ''} style={{textDecoration: 'none'}}>
            <div className={entryBack} style={style}>
                <div className={entryMid}>
                    <div className={entryFore}>
                        <div className={patternTitle}>{props.isMine ? <ChildIcon/> : ''} {props.patternTitle}</div>

                        <div className={smallMetaInfo}>{`domain: ${props.start}, ${props.end}`}</div>
                        <div className={smallMetaInfo}>{`${ratio}% fulfilled`}</div>
                        <div className={userUnits}>{props.isMine ? '--' : props.userUnits}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
// @flow
}
