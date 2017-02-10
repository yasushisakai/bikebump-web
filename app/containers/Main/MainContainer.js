import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { firebaseAuth } from 'config/constants'
import { fetchUIdfromEmail } from 'helpers/auth'
import { formatUser } from 'helpers/utils'

import { body } from 'styles/styles.css' 
import { container,contents } from './styles.css'

import { Navigation } from 'components'
import * as usersActionCreators from 'modules/users'

const MainContainer = React.createClass({
  propTypes:{
    isFetching: PropTypes.bool.isRequired,
    error : PropTypes.string.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    authedId: PropTypes.string.isRequired,
    isRecording: PropTypes.bool.isRequired,
    fetchingUserSuccess: PropTypes.func.isRequired,
    authUser : PropTypes.func.isRequired,
  },
  componentDidMount () {
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
    return this.props.isFetching === true
    ? null
    :<div className={container}>
        <Navigation isAuthed={this.props.isAuthed} isRecording={this.props.isRecording} authedId={this.props.authedId}/>
        <div id={'contents'} className={contents}>
          {this.props.children}
        </div>
      </div>
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
  return bindActionCreators(usersActionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(MainContainer)