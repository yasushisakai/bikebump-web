// @flow
import React from 'react';
import { Link } from 'react-router';
import { imgRoot } from 'config/constants';
import { captionText, divLink, navigation, navLink, actionLink, link, icon, recording, disabled } from './styles.css';
import Account from 'react-icons/lib/md/account-circle';
import SignIn from 'react-icons/lib/fa/sign-in';
import MapIcon from 'react-icons/lib/fa/map-o';
import Record from 'react-icons/lib/md/radio-button-checked';
import Home from 'react-icons/lib/md/home';

type Props = {
  isAuthed: boolean;
  authedId: string;
  isRecording: boolean;
};

const respondDivStyle: any = {
  background: `url(${imgRoot}choose.png)`,
  backgroundSize: '50px 50px',
  backgroundRepeat: 'no-repeat',
  width: '50px',
  height: '50px',
  display: 'inline-block',
  margin: 'auto',
  verticalAlign: 'middle',
};

const respondDivDisabled: any = {
  // background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${imgRoot}choose.png)`,
  background: `url(${imgRoot}choose_dark.png)`,
};

function vibrate () {
  window.navigator.vibrate(50);
  // console.log('mr brown can buzz')
}

function NavLinks ({isAuthed, isRecording, authedId}: Props) {
  return isAuthed
    ? <div className={navLink}>
      <div className={divLink}>
        <Link className={link} onClick={vibrate} to='/record'>
          <Record className={isRecording === true ? `${icon} ${recording}` : `${icon}`}/>
        </Link>
        <div className={captionText}>{`record`}</div>
      </div>
      <div className={divLink}>
        <Link className={link} onClick={vibrate} to='/map'>
          <MapIcon className={isRecording ? `${icon} ${disabled}` : `${icon}`}/></Link>
        <div className={captionText}>{'map'}</div>
      </div>
      <div className={divLink}>
        <Link className={link} onClick={vibrate} to={`/user/${authedId}/respond`}>
          <div style={isRecording ? {...respondDivStyle, ...respondDivDisabled} : respondDivStyle} /></Link>
        <div className={captionText}>{'survey'}</div>
      </div>
    </div>
    : <div className={navLink}>
      <div className={divLink}>
        <Link className={link} onClick={vibrate} to='/'><Home className={icon}/></Link>
        <div className={captionText}>{`bikebump`}</div>
      </div>
      <div className={divLink}>
        <Link className={link} onClick={vibrate} to='/map'><MapIcon className={icon}/></Link>
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
          <Link className={link} onClick={vibrate} to={accountLink}>
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
        <Link className={link} onClick={vibrate} to='/signin'><SignIn className={icon}/></Link>
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
