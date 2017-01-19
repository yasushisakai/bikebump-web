import {fromJS} from 'immutable'
import {addDing} from 'helpers/api'

const CREATE_DING = 'CREATE_DING'
const APPEND_DING = 'APPEND_DING'

function createDing(ding){
  return {
    type:CREATE_DING,
    ding
  }
}

function appendDing(dingId,{timestamp,uid,value}){
  return {
    type:APPEND_DING,
    dingId,
    timestamp,
    uid,
    value,
  }
}

export function handleCreateDing(ding){
  return function(dispatch) {
  const {dingId, dingPromise} = addDing(ding)
  dingPromise
    .then(()=>{
      dispatch(createDing({...ding,dingId}))
    })
  }
}

export function handleAppendDing(dingId,{timestamp,uid,value}){
  return function(dispatch){
    return
  }
}

const initialState = fromJS({
  lastUpdated : 0,
  isFetching : false,
  error : '',
})

export default function dings(state=initialState, action) {
  switch (action.type) {
    case CREATE_DING:
      return state.merge({
        [action.ding.dingId]:action.ding
      })
    case APPEND_DING:
      return state
    default:
      return state
  }
}