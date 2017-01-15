import React, { PropTypes } from 'react'

Main.propTypes = {
  isFetching:PropTypes.bool.isRequired,
  error:PropTypes.string.isRequired,
}

export default function Main (props) {
  return (
    <div>{props.isFetching === true 
      ? <p> {'Loading...'} </p>
      : <p> {'Hello world'} </p>
    }</div>
  )
}