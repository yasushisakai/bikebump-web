import React, { PropTypes } from 'react'
import {contents} from 'styles/styles.css'

export default function Auth (props) {
  return (
    <div className={contents}>
      <h1> Sign in to bikebump</h1>
      <div>
        {props.children}
      </div>
    </div>
  )
}
