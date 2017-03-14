import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { userContents } from './styles.css'

export default function User (props) {
  console.log(props)
  const calibrateLink = `/user/${props.uid}/calibrate`
  return (
    <div className={userContents}>
    {'User'}
    <h2>Settings</h2>
    <Link to={calibrateLink}><div> calibrate </div></Link>
    <Link to='/logout'>Logout</Link>
    </div>
  )
}