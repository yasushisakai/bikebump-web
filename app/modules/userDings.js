import { initialState} from 'config/constants' 
import { List } from 'immutable'
import { fetchUserDings } from 'helpers/api'
import { checkLastUpdate } from 'helpers/utils'

const FETCHING_USER_DINGS = 'FETCHING_USER_DINGS'
const FETCHING_USER_DINGS_ERROR = 'FETCHING_USER_DINGS_ERROR'
const FETCHING_USER_DINGS_SUCCESS = 'FETCHING_USER_DINGS_SUCCESS'

//
// status
//
export const userDingStatus = {
  DINGED : 'DINGED',
  PASSEDBY : 'PASSEDBY',
  VIRTUAL : 'VIRTUAL',
}

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

function fetchingUserDingsSuccess (uid,dingIdsAndStatus) {
  return {
    type: FETCHING_USER_DINGS_SUCCESS, 
    uid,
    dingIdsAndStatus,
  }
}

export function handleFetchingUserDings (uid) {
  return function(dispatch,getState){
    if(!checkLastUpdate(getState().userDings.get('lastUpdated'))){
      return Promise.resolve(getState().userDings.get('uid'))
    }
    dispatch(fetchingUserDings())
    return fetchUserDings(uid)
      .then((dings)=>{
        return dings
      })
      .then((dings)=>dispatch(fetchingUserDingsSuccess(uid,dings)))
      .catch((error)=>dispatch(fetchingUserDingsError(error)))
  }
}

export function addUserDing (uid,dingId,status) {
  return {
    type: ADD_USER_DING,
    uid,
    dingId,
    status,
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
        [action.uid]:action.dingIdsAndStatus
      })
    case ADD_USER_DING:
      return state.setIn([action.uid,action.dingId],action.status)
    default:
      return state
  }
}
