import React, { PropTypes } from 'react'

SoundClip.PropTypes={
  onClick:PropTypes.func.isRequired,
}

export default function SoundClip (props) {
  return (
    <div>
      {'SoundClip'}
      <div onClick={props.onClick}> {props.isCapturing === true ? 'caputuring...' : 'start recording'} </div>
    </div>

  )
}