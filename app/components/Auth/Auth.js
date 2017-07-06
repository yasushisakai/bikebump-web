// @flow
import React from 'react';
import {contents} from 'styles/styles.css';

type Props = {
  children?: React.Element<*>
};

export default function Auth ({children}: Props) {
    return (
        <div className={contents}>
            <h1>{'Sign in to bikebump'}</h1>
            <div>
                {children}
            </div>
        </div>
    );
}
