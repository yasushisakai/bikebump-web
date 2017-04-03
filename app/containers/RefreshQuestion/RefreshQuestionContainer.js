import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const RefreshQuestionContainer = React.createClass({
  propTypes:{
    isFetching : PropTypes.bool.isRequired,
    
    onClickOption: PropTypes.func.isRequired, 
  },
  componentDidMount () {
  },
  componentWillUpdate () {
  },
  render () {
    return null
  }
})
function mapStateToProps (state,props,) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(,dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(RefreshQuestionContainer)


