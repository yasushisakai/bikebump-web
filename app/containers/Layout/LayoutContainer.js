import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {Layout} from 'components'

const LayoutContainer = React.createClass({
  componentDidMount() {
    const layoutElement = document.getElementById('layout')
    const newElement = document.createElement('div')
    newElement.id='newElement'
    newElement.style.width = '100%'
    newElement.style.hwight = '100%'
    layoutElement .appendChild(newElement)
    console.log(layoutElement)
  },
  render () {
    return (
      <Layout />
    )
  }
})

// function mapStateToProps (state) {
//   return {

//   }
// }

// function mapDispatchToProps (dispatch) {
//   return bindActionCreators(,dispatch)
// }

// export default connect(mapStateToProps, 
// mapDispatchToProps)(LayoutContainer)

export default LayoutContainer