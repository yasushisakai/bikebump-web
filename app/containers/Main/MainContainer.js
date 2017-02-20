import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { firebaseAuth } from 'config/constants'
import { fetchUIdfromEmail } from 'helpers/auth'
import { formatUser } from 'helpers/utils'

import { body, container} from 'styles/styles.css' 

import { Navigation } from 'components'
import * as usersActionCreators from 'modules/users'
import * as userSettingsActionCreators from 'modules/userSettings'
import * as userDingsActionCreators from 'modules/userDings'
import * as userResponsesActionCreators from 'modules/userResponses'

const MainContainer = React.createClass({
  propTypes:{
    isFetching: PropTypes.bool.isRequired,
    error : PropTypes.string.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    authedId: PropTypes.string.isRequired,
    isRecording: PropTypes.bool.isRequired,

    fetchingUserSuccess: PropTypes.func.isRequired,
    authUser : PropTypes.func.isRequired,
    handleFetchingUserSettings: PropTypes.func.isRequired,
    handleFetchingUserDings: PropTypes.func.isRequired,
    handleFetchingUserResponses: PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.props.fetchingUser()
    firebaseAuth().onAuthStateChanged((user)=>{
      if(user){
        const userInfo = formatUser(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid
          )
        this.props.fetchingUserSuccess(user.uid,userInfo,Date.now())
        this.props.authUser(user.uid)
        this.props.handleFetchingUserSettings(user.uid)
        this.props.handleFetchingUserDings(user.uid)
        this.props.handleFetchingUserResponses(user.uid)
      }
    })

    // check if isRecording
    // if yes
      // and if interval is null
        // check commuteId && lastAttempt
          // setinterval(update)
        // initiate commute
      // keep one
  },
  render () {
     return (
      <div className={container}>
        <Navigation isAuthed={this.props.isAuthed} isRecording={this.props.isRecording} authedId={this.props.authedId}/>
          {this.props.children}
      </div>
    )
  },
})

function mapStateToProps ({users,record}) {
  return {
  isFetching : users.get('isFetching'),
  error: users.get('error'),
  isAuthed : users.get('isAuthed'),
  authedId: users.get('authedId'),
  isRecording : record.get('isRecording'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...usersActionCreators,
    ...userSettingsActionCreators,
    ...userDingsActionCreators,
    ...userResponsesActionCreators,
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(MainContainer)