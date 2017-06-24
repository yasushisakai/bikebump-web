// @flow
import React from 'react';
import { Link } from 'react-router';
import { logoutContents } from './styles.css';

export default function Logout () {
  return (
    <div className={logoutContents}>
      <h2>{'Logout'}</h2>
      <p>{'user successfully logged out'} </p>
      <Link to={'/'}>{'Home'}</Link>
    </div>
  );
}
