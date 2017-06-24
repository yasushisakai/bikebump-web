import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { userContents } from './styles.css';

User.propTypes = {
  uid: PropTypes.string.isRequired,
};

type Props = {
  uid: string;
}

export default function User ({uid}: Props) {
  console.log(uid);
  const calibrateLink = `/user/${uid}/calibrate`;
  return (
    <div className={userContents}>
      {'User'}
      <h2> {'Settings'} </h2>
      <Link to='/tests/recordSound'> {'record sound'} </Link>
      <Link to={calibrateLink}><div> {'calibrate'} </div> </Link>
      <Link to='/logout'> {'Logout'} </Link>
    </div>
  );
}
