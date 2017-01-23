import React, { PropTypes } from 'react'
import { Link } from 'react-router'

Logout.propTypes = {
  isAuthed : PropTypes.bool.isRequired,
}

export default function Logout (props) {
  return (
    <div>
      <h2>{'Logout'}</h2>
      <p>{'user successfully logged out'} </p>
      <Link to={'/'}>{'Home'}</Link>
    </div>
  )
}