import React, { PropTypes } from 'react'

export default function Auth (props) {
  return (
    <div><h1> Sign in to bikebump</h1>
    <div>
      {props.children}
    </div>
    </div>
  )
}