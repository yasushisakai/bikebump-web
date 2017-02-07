import React, { PropTypes } from 'react'
import {button} from './styles.css'

PlaySound.propTypes={
  onClickPlaySound: PropTypes.func.isRequired,
}

export default function PlaySound (props) {
  return (
    <div>
      <div className={button} onClick={props.onClickPlaySound}>Play Sound</div>
    </div>
  )
}