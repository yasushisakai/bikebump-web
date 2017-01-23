import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { firebaseAuth } from 'config/constants'
import { fetchUIdfromEmail } from 'helpers/auth'
import { formatUser } from 'helpers/utils'

import { body } from 'styles/styles.css' 
import { container } from './styles.css'

import { Navigation } from 'components'
import * as usersActionCreators from 'modules/users'

const MainContainer = React.createClass({
  propTypes:{
    isFetching: PropTypes.bool.isRequired,
    error : PropTypes.string.isRequired,
    isAuthed: PropTypes.bool.isRequired,
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
  },
  render () {
    return this.props.isFetching === true
    ? null
    :<div className={container}>
        <Navigation isAuthed={this.props.isAuthed}/>
        {this.props.children}
      </div>
  },
})

function mapStateToProps (state) {
  return {
  isFetching : state.users.get('isFetching'),
  error: state.users.get('error'),
  isAuthed : state.users.get('isAuthed'),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(usersActionCreators, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(MainContainer)