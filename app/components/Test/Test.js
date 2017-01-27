import React, { PropTypes } from 'react'


Test.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default function Test (props) {
  return (
    <div onClick={props.onClick}>{`Test`}</div>
  )
}