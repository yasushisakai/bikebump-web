import React, { PropTypes } from 'react'
import { Link } from 'react-router'

Logout.propTypes = {
  isAuthed : PropTypes.bool.isRequired,
}

export default function Logout (props) {
  return (
    <div>
      <h2>{'Logout'}</h2>
      {'user successfully logged out'}
      will redirect to Home shortly....
      <Link to={'/'}>{'Home'}</Link>
    </div>
  )
}