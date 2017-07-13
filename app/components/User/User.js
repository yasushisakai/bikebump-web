import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
    userContents,
    rankings,
    ranking,
} from './styles.css';
import BikeIcon from 'react-icons/lib/fa/bicycle';
import DiamondIcon from 'react-icons/lib/fa/diamond';
import EyeIcon from 'react-icons/lib/fa/eye';

User.propTypes = {
    uid: PropTypes.string.isRequired,

};

type Props = {
  uid: string;
  dingIds: string[];
  dingRank: number;
  responseRank: number;
  proposalRank: number;
}

function addAfter (num: number): string {
    const digit = num % 10;
    switch (digit) {
    case 1:
        return num + 'st';
    case 2:
        return num + 'nd';
    case 3:
        return num + 'rd';
    default:
        return num + 'st';
    }
}

export default function User ({uid, dingIds, dingRank, responseRank, proposalRank}: Props) {
    console.log(uid);
    const calibrateLink = `/user/${uid}/calibrate`;
    return (
        <div className={userContents}>
            {'User'}
            <h2> {'Rankings'} </h2>
            <div className={rankings}>
                <div className={ranking}><BikeIcon /> {addAfter(dingRank)}</div>
                <div className={ranking}><DiamondIcon /> {addAfter(proposalRank)}</div>
                <div className={ranking}><EyeIcon /> {addAfter(responseRank)}</div>
            </div>
            <h2> {'Settings'} </h2>
            <Link to='/tests/recordSound'> {'record sound'} </Link>
            <Link to={calibrateLink}><div> {'calibrate'} </div> </Link>
            <Link to='/logout'> {'Logout'} </Link>
        </div>
    );
}
