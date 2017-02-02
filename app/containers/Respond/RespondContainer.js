import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Respond } from 'components'
import * as usersActionCreators from 'modules/users'
import * as userResponseActionCreators from 'modules/userResponses'
import * as userDingsActionCreators from 'modules/userDings'

const RespondContainer = React.createClass({
  propTypes:{
    isFetching : PropTypes.bool.isRequired,
    responses : PropTypes.array.isRequired,
    handleFetchingUserResponses: PropTypes.func.isRequired,
    handleFetchingUserDings: PropTypes.func.isRequired,
  },
  componentDidMount(){
    this.props.handleFetchingUserResponses()
    this.props.handleFetchingUserDings()
  },
  render () {
    console.log(this.props.responses)
    return this.props.isFetching === true
    ? null
    : <Respond/>
  },
})

function mapStateToProps (state) {
  console.log(state.users.get('authedId'))
  return {
    isFetching:state.users.get('isFetching') || state.userResponses.get('isFetching') || state.userDings.get('isFetching'),
    responses : state.userResponses.get(state.users.get('authedId')),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
    ...usersActionCreators,
    ...userResponseActionCreators,
    ...userDingsActionCreators 
    },
      dispatch
    )
}

export default connect(mapStateToProps, 
mapDispatchToProps)(RespondContainer)