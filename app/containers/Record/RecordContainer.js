import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Pen from 'helpers/Pen'
import { fitCanvas } from 'helpers/utils'
import { Record } from 'components'

import * as userActionCreators from 'modules/users'


const RecordContainer = React.createClass({
  componentDidMount () {

    this.canvas = document.createElement('canvas')
    this.recordElement = document.getElementById('record')
    this.recordElement.appendChild(this.canvas)
    fitCanvas(this.canvas)

    this.pen = new Pen(this.canvas)

    this.setup()
    this.draw()
  },
  setup (){
    this.pen.strokeWidth(1)
  },
  draw (){
    requestAnimationFrame(this.draw)
    this.pen.clear()

    this.pen.noFill()
    this.pen.stroke('white')
    this.pen.drawCircle(this.canvas.width/2,this.canvas.height/2,this.canvas.width*0.325)
  },
  render () {

    return (
      <Record/>
    )
  },
})

function mapStateToProps (state) {
  return {
    isFetching : state.users.get('isFetching')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(userActionCreators, dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(RecordContainer)
// export default RecordContainer