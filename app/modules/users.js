import { fromJS } from 'immutable'
import { formatUser, clearStorage } from 'helpers/utils'
import { auth, redirectAuth, getCurrentUser, logout } from 'helpers/auth'
// users 

const FETCHING_USER = 'FETCHING_USER'
const FETCHING_USER_ERROR = 'FETCHING_USER_ERROR'
const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS'

const AUTH_USER = 'AUTH_USER'
const UNAUTH_USER = 'UNAUTH_USER'

export function fetchingUser(){
  return {
    type:FETCHING_USER,
  }
}

function fetchingUserError(error){
  console.warn(error)
  return {
    type:FETCHING_USER_ERROR,
    error:"error fetching user"
  }
}

export function fetchingUserSuccess(uid,user,timestamp){
  return {
    type:FETCHING_USER_SUCCESS,
    uid,
    user,
    timestamp,
  }
}

export function authUser(uid){
  return{
    type:AUTH_USER,
    uid,
  }
}

function unauthUser(){
  return{
    type:UNAUTH_USER,
  }
}

// this is triggered by a mouse click
export function handleUserAuthRedirect (service) {
  return function (dispatch) {
    dispatch(fetchingUser)
    return auth(service)
  }
} 

// this is triggered only when it is redirected from handleUserRedirect
export function handleUserAuthReturn (service) {
  return function (dispatch) {
    dispatch(fetchingUser)
    return redirectAuth(service)
      .then((user)=>dispatch(fetchingUserSuccess(user.uid,user,Date.now())))
      .then((user)=>dispatch(authUser(user.uid)))
      .catch((error)=>dispatch(fetchingUserError(error)))
  }
}

export function handleUserLogout (){
  return function (dispatch) {
    logout()
      .then(()=>dispatch(unauthUser()))
  }
} 

export function handleClearUser (){
  return function (dispatch) {
    getCurrentUser()
      .then((user)=>{
        if(user){
          clearStorage()
          return user.delete()
        }else{
          return null
        }
      })
      .then(()=>{dispatch(unauthUser())})
      .catch((error)=>dispatch(fetchingUserError(error))) 
  }
}

const initialUserState = fromJS({
  lastUpdated: 0,
  info: {
    name: '',
    uid: '',
    avatar: '',
    email: '',
  }
})

function user(state=initialUserState,action){
  switch (action.type){
    case FETCHING_USER_SUCCESS:
      return state.merge({
        lastUpdated: action.timestamp,
        info: action.user,
      })
      default:
      return state
  }
}

const initialState = fromJS({
  isAuthed: false,
  authedId: '',
  isFetching: false,
  error: '',
})

export default function users(state = initialState, action) {
  switch (action.type) {
    case FETCHING_USER:
      return state.merge({
        isFetching: true,
      })
    case FETCHING_USER_ERROR:
      return state.merge({
        isFetching: false,
        error: action.error,
      })
    case FETCHING_USER_SUCCESS:
      return action.uid === null
      ? state.merge({
        isFetching: false,
        error: '',
      }) 
      : state.merge({
        isFetching: false,
        error: '',
        [action.uid]: user(state.get('uid'), action),
      })
    case AUTH_USER:
      return state.merge({
        isAuthed: true,
        authedId: action.uid,
      })
    case UNAUTH_USER:
      return state.merge({
        isAuthed: false,
        authedId: ''
      })
    default:
      return state
  }
}