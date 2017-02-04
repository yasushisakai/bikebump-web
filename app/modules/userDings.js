import { initialState} from 'config/constants' 
import { CREATE_DING, APPEND_DING} from 'modules/dings'
import { List } from 'immutable'
import { fetchUserDings } from 'helpers/api'

const FETCHING_USER_DINGS = 'FETCHING_USER_DINGS'
const FETCHING_USER_DINGS_ERROR = 'FETCHING_USER_DINGS_ERROR'
const FETCHING_USER_DINGS_SUCCESS = 'FETCHING_USER_DINGS_SUCCESS'

const ADD_USER_DING='ADD_USER_DING'

function fetchingUserDings () {
  return {
    type: FETCHING_USER_DINGS, 
  }
}

function fetchingUserDingsError (error) {
  console.warn(error)
  return {
    type: FETCHING_USER_DINGS_ERROR, 
    error: 'error fetching user ding'
  }
}

function fetchingUserDingsSuccess (uid,dingIds) {
  return {
    type: FETCHING_USER_DINGS_SUCCESS, 
    uid,
    dingIds,
  }
}

export function handleFetchingUserDings () {
  return function(dispatch,getState){
    const uid = getState().users.get('authedId')
    dispatch(fetchingUserDings())
    fetchUserDings(uid)
      .then((dings)=>{
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



function singleDings(state=new List(),action){
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
    case FETCHING_USER_DINGS:
      return state.set('isFetching',true)
    case FETCHING_USER_DINGS_ERROR:
      return state.merge({
        isFetching:false,
        error:action.error,
      })
    case FETCHING_USER_DINGS_SUCCESS:
      return state.merge({
        isFetching:false,
        [action.uid]:action.dingIds
      })
    case APPEND_DING:
      return state.set(action.uid,singleDings(state.get(action.uid),action))
    case CREATE_DING:
      action.dingId = action.ding.dingId
      setl
      return state.set(action.ding.uid,singleDings(state.get(action.ding.uid),action))
    default:
      return state
  }
}
