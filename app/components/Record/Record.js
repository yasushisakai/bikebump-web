import React, { PropTypes, Component } from 'react'
import { recordContents } from './styles.css'
import { Map } from 'immutable'

export default function Record (props) {
  return (
    <div id='record' className={recordContents} />
  )
}
