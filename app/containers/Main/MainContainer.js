import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { firebaseAuth, isProduction } from 'config/constants'
import { fetchUIdfromEmail } from 'helpers/auth'
import { formatUser } from 'helpers/utils'
import { body, container} from 'styles/styles.css'
import { Navigation } from 'components'
import * as usersActionCreators from 'modules/users'

const MainContainer = React.createClass({
  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    isAuthed: PropTypes.bool.isRequired,
    authedId: PropTypes.string.isRequired,

    fetchingUserSuccess: PropTypes.func.isRequired,
    authUser: PropTypes.func.isRequired,
    removeFetchingUser: PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.props.fetchingUser()
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        // user is signed in
        const userInfo = formatUser(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid
          )
        this.props.fetchingUserSuccess(user.uid, userInfo, Date.now())
        this.props.authUser(user.uid)
      } else {
        // user is not signed
        this.props.removeFetchingUser()
      }
    })
  },
  shouldComponentUpdate (nextProps) {
    return true
  },
  render () {
    const mode = isProduction ? 'production' : 'dev'

    return this.props.isFetching
    ? <div> {'loading user...'} </div>
    : (
      <div className={container}>
        <Navigation isAuthed={this.props.isAuthed} isRecording={this.props.isRecording} authedId={this.props.authedId}/>
          {this.props.children}
      </div>
    )
  },
})

function mapStateToProps ({users, record}) {
  return {
    isFetching: users.get('isFetching'),
    error: users.get('error'),
    isAuthed: users.get('isAuthed'),
    authedId: users.get('authedId'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...usersActionCreators,
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(MainContainer)
