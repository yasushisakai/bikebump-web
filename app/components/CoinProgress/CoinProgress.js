// @flow
import React from 'react';
import {
    coinProgressContainer,
    bar,
    back,
    fore,
    info,
    smallInfo,
    remaining,
    unit,
    left,
} from './styles.css';

type Props = {
    currentPoints: number;
    maxPoints: number;
    showInfo: boolean;
}

export default function CoinProgress ({currentPoints, maxPoints, showInfo}: Props) {
    const percentile = `${(currentPoints / maxPoints) * 100}%`;
    const coinsLeft = maxPoints - currentPoints;
    const numberInfo = showInfo
        ? (<div className={info}>
            <div className={remaining}>{coinsLeft}</div>
            <div className={unit}/>
            <div className={left}>{`'s to go!`}</div>
        </div>)
        : (
            <div className={smallInfo}>{coinsLeft}</div>
        );
    return (
        <div className={coinProgressContainer}>
            <div className={bar}>
                <div className={back}>
                    <div className={fore} style={{width: percentile}}/>
                </div>
            </div>
            {numberInfo}
        </div>
    );
}
