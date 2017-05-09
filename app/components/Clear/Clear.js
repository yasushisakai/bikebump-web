import React, { PropTypes } from 'react'

Clear.propTypes = {
  isAuthed: PropTypes.bool.isRequired,
  authedId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default function Clear (props) {
  return (
    <div>
    <h2> {'Clear'} </h2>
    <div>{`am I authed? ${props.isAuthed}, ${props.authedId}`}</div>
    <div onClick={props.onClick}>{'clear data'}</div>
    </div>
  )
}
