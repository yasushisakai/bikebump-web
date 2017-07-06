// @flow
import React from 'react';
import { RangeSliderContainer } from 'containers';

import {
    createPanel,
    createSlider,
    patternSelector,
    proposalInfo,
    submitButton,
} from './styles.css';

type Props = {
    onSelectPattern: Function;
    onChangeSlider: Function;
    onClickSubmit: Function;
}

export default function CreatePanel ({onChangeSlider, onSelectPattern, onClickSubmit}: Props) {
    return (
        <div className={createPanel}>
            <div className={createSlider}>
                <RangeSliderContainer/>
            </div>
            <div className={patternSelector} onClick={onSelectPattern}>{'patternSelector'}</div>
            <div className={proposalInfo}>{`summary of proposal`}</div>
            <div className={submitButton} onClick={onClickSubmit}>{'submit'}</div>
        </div>
    );
// @flow
}
