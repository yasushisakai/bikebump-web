import React, { PropTypes } from 'react'

Main.propTypes = {
}

export default function Main (props) {
  return (
    <div>
    {'Main'}
    {props.children}
    </div>
  )
}