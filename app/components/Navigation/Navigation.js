import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { imgRoot } from 'config/constants'
import { navigation, navLink, actionLink, link, icon, iconRecording } from './styles.css'
import Account from 'react-icons/lib/md/account-circle'
import SignIn from 'react-icons/lib/fa/sign-in'
import MapIcon from 'react-icons/lib/fa/map-o'
import Record from 'react-icons/lib/md/radio-button-checked'
import Home from 'react-icons/lib/md/home'

Navigation.propTypes = NavLinks.propTypes = ActionLinks.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  authedId: PropTypes.string.isRequired,
  isRecording: PropTypes.bool.isRequired,
}

Navigation.defaultProps = {
  isRecording: false,
}

const respondDivStyle = {
  backgroundImage: `url(${imgRoot}choose.png)`,
  backgroundSize: '50px 50px',
  backgroundRepeat: 'no-repeat',
  width: '50px',
  height: '50px',
  display: 'inline-block',
  margin: 'auto',
  verticalAlign: 'middle',
}

function vibrate () {
  window.navigator.vibrate(50)
  // console.log('mr brown can buzz')
}

function NavLinks ({isAuthed, isRecording, authedId}) {
  return isAuthed === true
  ? <div className={navLink}>
    <Link className={link} onClick={vibrate} to='/record'><Record className={isRecording === true ? iconRecording : icon}/></Link>
    <Link className={link} onClick={vibrate} to='/map'><MapIcon className={icon}/></Link>
    <Link className={link} onClick={vibrate} to={`/user/${authedId}/respond`}><div style={respondDivStyle} /></Link>
  </div>
  : <div className={navLink}>
    <Link className={link} onClick={vibrate} to='/'><Home className={icon}/></Link>
    <Link className={link} onClick={vibrate} to='/map'><MapIcon className={icon}/></Link>
  </div>
}

function ActionLinks ({isAuthed, authedId}) {
  const accountLink = `/user/${authedId}`

  return isAuthed === true
  ? <div className={actionLink}>
    <Link className={link} onClick={vibrate} to={accountLink}> <Account className={icon}/></Link>
  </div>
  : <div className={actionLink}>
    <Link className={link} onClick={vibrate} to='/signin'><SignIn className={icon}/></Link>
  </div>
}

export default function Navigation ({isAuthed, isRecording, authedId}) {
  return (
    <div id={'navigation'} className={navigation}>
    <NavLinks isAuthed={isAuthed} isRecording={isRecording} authedId={authedId}/>
    <ActionLinks isAuthed={isAuthed} isRecording={isRecording} authedId={authedId}/>
    </div>
  )
}
