import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { navigation, navLink, actionLink, link, icon } from './styles.css'
import Account from 'react-icons/lib/md/account-circle'
import SignOut from 'react-icons/lib/fa/sign-out'
import SignIn from 'react-icons/lib/fa/sign-in'
import MapIcon from 'react-icons/lib/fa/map-o'
import Record from 'react-icons/lib/md/radio-button-checked'
import Home from 'react-icons/lib/md/home'

Navigation.propTypes=NavLinks.propTypes=ActionLinks.propTypes={
  isAuthed : PropTypes.bool.isRequired,
}

function NavLinks ({isAuthed}) {
  return isAuthed===true
  ? <div className={navLink}>
    <Link className={link} to='/record'><Record className={icon}/></Link>
    <Link className={link} to='/map'><MapIcon className={icon}/></Link>
  </div>
  : <div className={navLink}>
    <Link className={link} to='/'><Home className={icon}/></Link>
    <Link className={link} to='/map'><MapIcon className={icon}/></Link>
  </div>
}

function ActionLinks ({isAuthed}) {
  return isAuthed === true
  ? <div className={actionLink}>
    <Link className={link} to='/user/testuserId'><Account className={icon}/></Link>
    <Link className={link} to='/logout'><SignOut className={icon}/></Link>
  </div>
  : <div className={actionLink}>
    <Link className={link} to='/signin'><SignIn className={icon}/></Link>
  </div>
}

export default function Navigation ({isAuthed}) {
  return (
    <div className={navigation}>
    <NavLinks isAuthed={isAuthed} />
    <ActionLinks isAuthed={isAuthed} />
    </div>
  )
}