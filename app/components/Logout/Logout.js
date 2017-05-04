import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { logoutContents } from './styles.css'

Logout.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
}

export default function Logout (props) {
  return (
    <div className={logoutContents}>
      <h2>{'Logout'}</h2>
      <p>{'user successfully logged out'} </p>
      <Link to={'/'}>{'Home'}</Link>
    </div>
  )
}
