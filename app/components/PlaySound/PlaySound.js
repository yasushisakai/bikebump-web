// @flow
import React from 'react';
import {button} from './styles.css';

type Props = {
  onClickPlaySound: () => void;
}

export default function PlaySound ({onClickPlaySound}: Props) {
    return (
        <div>
            <div className={button} onClick={onClickPlaySound}>{'Play Sound'} </div>
        </div>
    );
}
