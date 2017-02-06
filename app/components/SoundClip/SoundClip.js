import React, { PropTypes } from 'react'
import { bigButton, bigButtonDisabled } from './styles.css'

SoundClip.PropTypes={
  onClick:PropTypes.func.isRequired,
  bufferSize:PropTypes.number.isRequired,
}

export default function SoundClip (props) {

  function onClick (e) {
    e.preventDefault()
    return props.isUploading === true ? null : props.onClick()
  }
  return (
    <div>
      {'SoundClip'}
      <div className={props.isUploading === true ? bigButtonDisabled : bigButton} onClick={onClick}> {props.isUploading === true ? 'uploading...' : 'start recording'} </div>
      {props.bufferSize}
    </div>

  )
}