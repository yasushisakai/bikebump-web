import React, { PropTypes } from 'react'

SoundClip.PropTypes={
  onClickStart:PropTypes.func.isRequired,
  onClickStop:PropTypes.func.isRequired,
}

export default function SoundClip (props) {
  return (
    <div>
      {'SoundClip'}
      <div onClick={props.onClickStart}> start recording </div>
      <div onClick={props.onClickStop}> stop recording </div>
    </div>

  )
}