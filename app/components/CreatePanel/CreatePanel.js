// @flow
import React from 'react';
import { RangeSliderContainer } from 'containers';
import { Button } from '@blueprintjs/core';

import {
    createPanel,
    createSlider,
    createSliderInner,
    patternSelector,
    infoAndBtn,
    proposalInfo,
    submitButton,
    button,
} from './styles.css';

type Props = {
    requiredUnits: number;
    disabled: boolean;
    optionsInfo: Array<Array<string>>;
    onSelectPattern: Function;
    onChangeSlider: Function;
    onClickSubmit: Function;
}

export default function CreatePanel ({requiredUnits, disabled, optionsInfo, onChangeSlider, onSelectPattern, onClickSubmit}: Props) {
    
    // const optionsInfo = [
    //     ['-KbMbV6KN6h0C3QDyoyI', 'Green Paint: 50/m'],
    //     ['-KdTuaiUjQyK1kN4zkuI', 'Bike Box: 200 ea road'],
    //     ['-KdTv3G639n14nloOkd5', 'Studs: 250/m'],
    // ];

    const options = optionsInfo.map((optionInfo) => (
        <option value={optionInfo[0]} key={optionInfo[0]}> {optionInfo[1]} </option>
    ));

    return (
        <div className={createPanel}>
            <div className={patternSelector} >
                <select onChange={onSelectPattern}>
                    <option value={''}>{'pick a pattern'}</option>
                    {options}
                </select>
            </div>
            <div className={createSlider}>
                <div className={createSliderInner}>
                    <RangeSliderContainer/>
                </div>
            </div>
            <div className={infoAndBtn}>
                <div className={proposalInfo}>{`requires ${requiredUnits} units for submission.`}</div>
                <div className={submitButton}><Button disabled={disabled} className={button} text={'submit!'}/></div>
            </div>
        </div>
    );
// @flow
}
