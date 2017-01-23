import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Logout } from 'components'
import * as userActionCreators from 'modules/users'

const LogoutContainer = React.createClass({
  propTypes:{
    isAuthed:PropTypes.bool.isRequired,
    handleUserLogout:PropTypes.func.isRequired,
  },
  contextTypes:{
    router: PropTypes.object.isRequired,
  },
  componentDidMount () {
    this.props.handleUserLogout()
  },
  render () {
    return (
      <Logout isAuthed={this.props.isAuthed} />
    )
  },
})

function mapStateToProps (state) {
  return {
    isAuthed:state.users.get('isAuthed'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(userActionCreators,dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(LogoutContainer)