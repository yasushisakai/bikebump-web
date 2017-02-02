import { initialState } from 'config/constants' 
import { CREATE_DING, APPEND_DING} from 'modules/dings'
import { List } from 'immutable'
import { fetchUserDings } from 'helpers/api'

const FETCH_USER_DINGS = 'FETCH_USER_DINGS'
const FETCH_USER_DINGS_ERROR = 'FETCH_USER_DINGS_ERROR'
const FETCH_USER_DINGS_SUCCESS = 'FETCH_USER_DINGS_SUCCESS'

const ADD_USER_DING='ADD_USER_DING'


function fetchingUserDings () {
  return {
    type: FETCH_USER_DINGS, 
  }
}

function fetchingUserDingsError (error) {
  console.warn(error)
  return {
    type: FETCH_USER_DINGS_ERROR, 
    error: 'error fetching user ding'
  }
}

function fetchingUserDingsSuccess (uid,dings) {
  return {
    type: FETCH_USER_DINGS_SUCCESS, 
    uid,
    dings,
  }
}

export function handleFetchingUserDings () {
  return function(dispatch,getState){
    const uid = getState().users.get('authedId')
    fetchUserDings(uid)
      .then((dings)=>{
        console.log(dings)
        return dings
      })
      .then((dings)=>dispatch(fetchingUserDingsSuccess(uid,dings)))
      .catch((error)=>dispatch(fetchingUserDingsError(error)))
  }
}

function addUserDing (uid,ding) {
  return {
    type: ADD_USER_DING,
    uid,
    ding
  }
}



function dings(state=new List(),action){
  switch (action.type) {
    case CREATE_DING:
    case APPEND_DING:
      return state.push(action.dingId)
    default:
     return state
  }
}

export default function userDings (state=initialState,action) {
  switch (action.type) {
    case FETCH_USER_DINGS:
      return state.set('isFetching',true)
    case FETCH_USER_DINGS_ERROR:
      return state.merge({
        isFetching:false,
        error:action.error,
      })
    case FETCH_USER_DINGS_SUCCESS:
      return state.merge({
        isFetching:false,
        [action.uid]:action.dings
      })
    case APPEND_DING:
      return state.set(action.uid,dings(state.get(action.uid),action))
    case CREATE_DING:
      action.dingId = action.ding.dingId
      return state.set(action.ding.uid,dings(state.get(action.ding.uid),action))
    default:
      return state
  }
}
