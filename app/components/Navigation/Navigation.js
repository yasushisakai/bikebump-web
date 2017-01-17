import React, { PropTypes } from 'react'
import { Link } from 'react-router'

Navigation.propTypes=NavLinks.propTypes=ActionLinks.propTypes={
  isAuthed : PropTypes.bool.isRequired,
}

function NavLinks ({isAuthed}) {
  return isAuthed===true
  ? <div>
    <Link to='/record'>{'Record'}</Link>
    <Link to='/map'>{'Map'}</Link>
  </div>
  : <div>
    <Link to='/home'>{'Home'}</Link>
    <Link to='/map'>{'Map'}</Link>
  </div>
}

function ActionLinks ({isAuthed}) {
  return isAuthed === true
  ? <div>
    <Link to='/user/testuserId'>{'user'}</Link>
    <Link to='/logout'>{'logout'}</Link>
  </div>
  : <div>
    <Link to='/signin'>{'log in/sign in'}</Link>
  </div>
}




export default function Navigation ({isAuthed}) {
  return (
    <div>{'Navigation'}
    <NavLinks isAuthed={isAuthed} />
    <ActionLinks isAuthed={isAuthed} />
    </div>
  )
}