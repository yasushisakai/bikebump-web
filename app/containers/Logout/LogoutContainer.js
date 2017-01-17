import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { logout } from 'helpers/auth'
import { unauthUser } from 'modules/users'

import { Logout } from 'components'
const LogoutContainer = React.createClass({
  propTypes:{
    dispatch : PropTypes.func.isRequired,
  },
  componentDidMount(){
    logout()
    this.props.dispatch(unauthUser())
  },
  render () {
    return (
      <Logout />
    )
  },
})

export default connect()(LogoutContainer)