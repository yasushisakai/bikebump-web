// @flow
import React from 'react';
import {
    header,
    authContainer,
    loginButtons,
} from './styles.css';

type Props = {
  children?: React.Element<*>
};

export default function Auth ({children}: Props) {
    return (
        <div className={authContainer}>
            <div className={header}>{'Sign in to bikebump'}</div>
            {`select account for sign up`}
            <div className={loginButtons}>
                {children}
            </div>
        </div>
    );
}
