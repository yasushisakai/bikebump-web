import React, { PropTypes } from 'react'
import { bigButton } from './styles.css'

SoundClip.PropTypes={
  onClick:PropTypes.func.isRequired,
}

export default function SoundClip (props) {
  return (
    <div>
      {'SoundClip'}
      <div className={bigButton} onClick={props.onClick}> {props.isCapturing === true ? 'caputuring...' : 'start recording'} </div>
    </div>

  )
}