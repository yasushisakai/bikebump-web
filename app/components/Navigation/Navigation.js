// @flow
import React from 'react';
import { Link } from 'react-router';
import { imgRoot } from 'config/constants';
import { captionText, divLink, navigation, navLink, actionLink, link, icon, recording, disabled } from './styles.css';
import Account from 'react-icons/lib/md/account-circle';
import SignIn from 'react-icons/lib/fa/sign-in';
import MapIcon from 'react-icons/lib/fa/map-o';
import Record from 'react-icons/lib/md/radio-button-checked';
import PrioritizeIcon from 'react-icons/lib/fa/list-ol';
import Home from 'react-icons/lib/md/home';
import { vibrate } from 'helpers/utils';

type Props = {
  isAuthed: boolean;
  authedId: string;
  isRecording: boolean;
};

const iconSize: number = 41;
const respondDivStyle: any = {
    background: `url(${imgRoot}choose.png)`,
    backgroundSize: `${iconSize}px ${iconSize}px`,
    backgroundRepeat: 'no-repeat',
    width: `${iconSize}px`,
    height: `${iconSize}px`,
    display: 'inline-block',
    margin: 'auto',
    verticalAlign: 'middle',
};

const respondDivDisabled: any = {
    // background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgRoot}choose.png)`,
    background: `url(${imgRoot}choose_dark.png)`,
};

type IconProps = {
  isRecording : boolean
}

function RecordButton ({isRecording}: IconProps) {
    if (isRecording) {
        return (<div className={divLink}>
            <Record className={`${icon} ${recording}`}/>
            <div className={`${captionText} ${recording}`}>{`record`}</div>
        </div>);
    } else {
        return (<div className={divLink}>
            <Link className={link} onClick={vibrate(50)} to='/record'>
                <Record className={icon}/>
            </Link>
            <div className={captionText}>{`record`}</div>
        </div>);
    }
}

function MapButton ({isRecording}: IconProps) {
    const label: string = 'map';
    if (isRecording) {
        return (<div className={divLink}>
            <MapIcon className={`${icon} ${disabled}`}/>
            <div className={`${captionText} ${disabled}`}>{label}</div>
        </div>);
    } else {
        return (<div className={divLink}>
            <Link className={link} onClick={vibrate(50)} to={label}>
                <MapIcon className={icon}/>
            </Link>
            <div className={captionText}>{label}</div>
        </div>);
    }
}

function SurveyButton ({isAuthed, isRecording, authedId}: Props) {
    if (isRecording) {
        return (
            <div className={divLink}>
                <div style={{...respondDivStyle, ...respondDivDisabled}} />
                <div className={`${captionText} ${disabled}`}>{'survey'}</div>
            </div>
        );
    } else {
        return (
            <div className={divLink}>
                <Link className={link} onClick={vibrate(50)} to={`/user/${authedId}/respond`}>
                    <div style={respondDivStyle} />
                </Link>
                <div className={captionText}>{'survey'}</div>
            </div>
        );
    }
}

function PrioritizeButton ({isAuthed, isRecording, authedId}: Props) {
    if (isRecording) {
        return (
            <div className={divLink}>
                <PrioritizeIcon className={`${icon} ${disabled}`}/>
                <div className={`${captionText} ${disabled}`}>{'prioritize'}</div>
            </div>
        );
    } else {
        return (
            <div className={divLink}>
                <Link className={link} onClick={vibrate(50)} to={`/proposals`}>
                    <PrioritizeIcon className={icon} />
                </Link>
                <div className={captionText}>{'prioritize'}</div>
            </div>
        );
    }
}

function NavLinks ({isAuthed, isRecording, authedId}: Props) {
    return isAuthed
        ? <div className={navLink}>
            <RecordButton isRecording={isRecording} />
            <MapButton isRecording={isRecording} />
            <SurveyButton isAuthed={isAuthed} isRecording={isRecording} authedId={authedId} />
            <PrioritizeButton isAuthed={isAuthed} isRecording={isRecording} authedId={authedId} />
        </div>
        : <div className={navLink}>
            <div className={divLink}>
                <Link className={link} onClick={vibrate(50)} to='/'><Home className={icon}/></Link>
                <div className={captionText}>{`bikebump`}</div>
            </div>
            <div className={divLink}>
                <Link className={link} onClick={vibrate(50)} to='/map'><MapIcon className={icon}/></Link>
                <div className={captionText}>{'map'}</div>
            </div>
        </div>;
}

function ActionLinks ({isAuthed, isRecording, authedId}: Props) {
    const accountLink = `/user/${authedId}`;

    function disableWhenRecording () {
        if (isRecording) {
            return (
                <div className={divLink}>
                    <Account className={`${icon} ${disabled}`}/>
                    <div className={`${captionText} ${disabled}`}>{'mystuff'}</div>
                </div>
            );
        } else {
            return (
                <div className={divLink}>
                    <Link className={link} onClick={vibrate(50)} to={accountLink}>
                        <Account className={icon}/>
                    </Link>
                    <div className={captionText}>{'mystuff'}</div>
                </div>
            );
        }
    }

    return isAuthed
        ? <div className={actionLink}>
            <div className={divLink}>
                {disableWhenRecording()}
            </div>
        </div>
        : <div className={actionLink}>
            <div className={divLink}>
                <Link className={link} onClick={vibrate(50)} to='/signin'><SignIn className={icon}/></Link>
                <div className={captionText}>{'sign in'}</div>
            </div>
        </div>;
}

export default function Navigation ({isAuthed, isRecording, authedId}: Props) {
    return (
        <div id={'navigation'} className={navigation}>
            <NavLinks isAuthed={isAuthed} isRecording={isRecording} authedId={authedId}/>
            <ActionLinks isAuthed={isAuthed} isRecording={isRecording} authedId={authedId}/>
        </div>
    );
}
