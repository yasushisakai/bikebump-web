import React, { PropTypes } from 'react'

RecordSound.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  handleRecord: PropTypes.func.isRequired,
}

export default function RecordSound (props) {
  function status () {
    return props.isRecording ? 'start recording' : 'stop recording'
  }
  return (
    <div>
    <h2>{'RecordSound'}</h2>
    <div onClick={props.handleRecord}> {status()} </div>
    </div>
  )
}
