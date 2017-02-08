import React, { PropTypes } from 'react'
import {Link} from 'react-router'

export default function User (props) {
  console.log(props)
  const calibrateLink = `/user/${props.uid}/calibrate`
  return (
    <div>{'User'}
    <h2>Settings</h2>
    <Link to={calibrateLink}><div> calibrate </div></Link>
    </div>
  )
}