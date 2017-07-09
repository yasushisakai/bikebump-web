// @flow
import React from 'react';
import { Link } from 'react-router';
import { imgRoot } from 'config/constants';
import ChildIcon from 'react-icons/lib/fa/child';

import {CoinProgress} from 'components';

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
    per: string;
    patternUnits: number;
};

export default function ProposalListItem (props: Props) {
    const imageURL: string = `${imgRoot}patternBackgrounds/${props.image}.jpg`;

    const style: Object = {};
    style.background = `url(${imageURL}) center`;
    style.backgroundSize = 'cover';

    const length = Math.floor(3.28084 * (props.end - props.start) * props.maxUnits / props.patternUnits);
    const lengthInfo = props.per === 'road' ? ' ' : `length: ${length}ft`;

    return (
        <Link to={`/proposals/${props.proposalId}`} className={props.isMine ? disabled : ''} style={{textDecoration: 'none'}}>
            <div className={entryBack} style={style}>
                <div className={entryMid}>
                    <div className={entryFore}>
                        <div className={patternTitle}>{props.patternTitle} {props.isMine ? <ChildIcon/> : ''}</div>

                        <div className={smallMetaInfo}>{lengthInfo}</div>
                        <div style={{width: '50%'}}><CoinProgress
                            currentPoints={props.currentUnits}
                            maxPoints={props.maxUnits}
                            showInfo={false}/>
                        </div>
                        <div className={userUnits}>{props.userUnits}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
// @flow
}
