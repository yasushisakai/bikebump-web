// @flow
import React from 'react';
import { RangeSliderContainer } from 'containers';
import QuestionIcon from 'react-icons/lib/fa/question';
import { Link } from 'react-router';
import { imgRoot } from 'config/constants';

import {
    createPanel,
    createSlider,
    createSliderInner,
    patternSelector,
    selector,
    moreInfo,
    questionMark,
    mark,
    infoAndBtn,
    totalUnits,
    units,
    unitIcon,
    otherText,
    proposalInfo,
    submitButton,
    disabled,
    button,
} from './styles.css';

type Props = {
    requiredUnits: number;
    backgroundImage: string;
    submitDisabled: boolean;
    optionsInfo: Array<Array<string>>;
    onSelectPattern: Function;
    onChangeSlider: Function;
    onClickSubmit: Function;
}

export default function CreatePanel ({requiredUnits, backgroundImage, submitDisabled, sliderDisabled, optionsInfo, onChangeSlider, onSelectPattern, onClickSubmit}: Props) {
    // const optionsInfo = [
    //     ['-KbMbV6KN6h0C3QDyoyI', 'Green Paint: 50/m'],
    //     ['-KdTuaiUjQyK1kN4zkuI', 'Bike Box: 200 ea road'],
    //     ['-KdTv3G639n14nloOkd5', 'Studs: 250/m'],
    // ];

    const options = optionsInfo.map((optionInfo) => (
        <option value={optionInfo[0]} key={optionInfo[0]}> {optionInfo[1]} </option>
    ));
    const baseStyle = {position: 'absolute', width: '100%', height: '50%'};
    const backgroundURL = backgroundImage === '' ? '' : `url(${imgRoot}patternBackgrounds/${backgroundImage}.jpg) no-repeat center`;

    let submitButtonClassName = `pt-button pt-large ${button}`;
    submitButtonClassName += submitDisabled ? ` ${disabled}` : '';

    return (
        <div>
            <div style={{...baseStyle, zIndex: '0', background: backgroundURL, backgroundSize: 'cover'}}/>
            <div style={{...baseStyle, zIndex: '1', background: 'rgba(17, 17, 17, 0.6)'}} />
            <div className={createPanel}>
                <div className={patternSelector}>
                    <div className={selector} >
                        <select onChange={onSelectPattern}>
                            <option value={''}>{'pick solution type'}</option>
                            {options}
                        </select>
                    </div>
                    <div className={moreInfo}>
                        <Link to='record' className={questionMark}><QuestionIcon className={mark}/></Link>
                    </div>
                </div>
                <div className={createSlider}>
                    <div className={createSliderInner}>
                        <RangeSliderContainer onChangeSlider={onChangeSlider}/>
                    </div>
                </div>
                <div className={infoAndBtn}>
                    <div className={proposalInfo}>
                        <div className={totalUnits}>
                            <div className={units}>{`${requiredUnits}`}</div>
                            <div className={unitIcon}/>
                        </div>
                        <div className={otherText}>{'for community approval'} </div>
                    </div>
                    <div className={submitButton}>
                        <div className={submitButtonClassName} onClick={onClickSubmit}>
                            {'submit!'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
