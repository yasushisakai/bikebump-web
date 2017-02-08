import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as userActionCreators from 'modules/users'
import * as userResponsesActionCreators from 'modules/userResponses'
import * as userDingsActionCreators from 'modules/userDings'
import * as userVotesActionCreators from 'modules/userVotes'

const AddResponseVotesContainer = React.createClass({
  propTypes:{
    authedId:PropTypes.string.isRequired,

    handleFetchingUserResponses: PropTypes.func.isRequired,
    handleFetchingUserVotes: PropTypes.func.isRequired,
    handleFetchingUserDings: PropTypes.func.isRequired,

  },
  contextTypes:{
    router:PropTypes.object.isRequired,
  },
  componentDidMount () {

    console.log(this.context.router.params.uid)
    

    this.props.handleFetchingUserDings()
    this.props.handleFetchingUserVotes('3roLqCU3gMMl2CqzyAjpbbJraOk2')
    this.props.handleFetchingUserResponses('3roLqCU3gMMl2CqzyAjpbbJraOk2')
  },
  render () {
    return (
      <div>{' -- add response vote container  -- '}</div>
      )
  },
})

function mapStateToProps (state) {
  return {
    users: state.users,
    authedId : '3roLqCU3gMMl2CqzyAjpbbJraOk2'
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...userActionCreators,
    ...userResponsesActionCreators,
    ...userDingsActionCreators,
    ...userVotesActionCreators,
  },dispatch)
 }

export default connect(mapStateToProps, 
mapDispatchToProps)(AddResponseVotesContainer)
