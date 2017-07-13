import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {
    userContainer,
    rank,
    ranks,
    small,
    rankings,
    settings,
    header,
    entry,
    result,
    title,
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
        <div className={userContainer}>
            <div className={rankings}>
                <div className={header}> {'Rankings'} </div>
                <div className={ranks}>
                    <div className={rank}>
                        <div className={entry}><div className={title}><BikeIcon /> {'Ding Collector'}</div>
                            <div className={result}>{addAfter(dingRank)}</div>
                        </div>
                        <div className={small}>
                            {'the total number of your reports and ding areas passed.'}
                        </div>
                    </div>
                    <div className={rank}>
                        <div className={entry}><div className={title}><DiamondIcon /> {'Grassroot Planner'}</div>
                            <div className={result}>{addAfter(proposalRank)}</div>
                        </div>
                        <div className={small}>
                            {'the number of bike coins that was collected though improvements created by you.'}
                        </div>
                    </div>
                    <div className={rank}>
                        <div className={entry}><div className={title}><EyeIcon /> {'Reporter'}</div>
                            <div className={result}>{addAfter(responseRank)}</div>
                        </div>
                        <div className={small}>
                            {'the number of surveys answered to provide detailed information of the current state.'}
                        </div>
                    </div >
                </div>
            </div>
            <div className={settings}>
                <div className={header}> {'Settings'} </div>
                {/* <Link to='/tests/recordSound'> {'record sound'} </Link> */}
                <Link to={calibrateLink}><div className={`pt-button pt-large`}> {'recalibrate your bell'} </div> </Link>
                <Link to='/logout'><div className={`pt-button pt-large`}>{'logout'}</div></Link>
            </div>
        </div>
    );
}
