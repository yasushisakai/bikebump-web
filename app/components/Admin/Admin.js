import React, { PropTypes } from 'react'
export default function Admin (props) {
  return (
    <div>{'Admin'}
    {props.children}
    </div>
  )
}