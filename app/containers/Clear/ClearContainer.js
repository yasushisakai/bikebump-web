import React, { PropTypes } from 'react'
import { Clear } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'modules/users'

const ClearContainer = React.createClass({
  propTypes: {
    isAuthed: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    authedId: PropTypes.string.isRequired,
    handleClearUser: PropTypes.func.isRequired,
  },
  handleClick () {
    this.props.handleClearUser()
  },
  render () {
    return (
     <Clear
      isFetching={this.props.isFetching}
      isAuthed={this.props.isAuthed}
      authedId={this.props.authedId}
      onClick={this.handleClick}/>
    )
  },
})

function mapStateToProps ({users}) {
  return {
    isAuthed: users.get('isAuthed'),
    authedId: users.get('authedId'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(userActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearContainer)
