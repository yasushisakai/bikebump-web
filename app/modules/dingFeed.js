import { fromJS } from 'immutable' 
import { listenToDings } from 'helpers/api'
import { addListener } from 'modules/listeners'
import { addMultipleDings } from 'modules/dings'

const SETTING_DING_LISTENER = 'SETTING_DING_LISTENER'
const SETTING_DING_LISTENER_ERROR = 'SETTING_DING_LISTENER_ERROR'
const SETTING_DING_LISTENER_SUCCESS = 'SETTING_DING_LISTENER_SUCCESS'

function settingDingListener () {
  return {
    type:SETTING_DING_LISTENER,
  }
}

function settingDingListenerError (error) {
  console.log(error)
  return {
    type:SETTING_DING_LISTENER_ERROR,
    error : 'error setting ding listener',
  }
}

function settingDingListenerSuccess (dingIds) {
  return {
    type: SETTING_DING_LISTENER_SUCCESS,
    dingIds
  }
}

export function handleSetDingListener () {
  return function (dispatch,getState) {

    if(getState().listeners.get('dings')===true){
      return
    }
    dispatch(settingDingListener())
    dispatch(addListener('dings'))
    listenToDings((dings)=>{
      dispatch(addMultipleDings(dings))
      dispatch(settingDingListenerSuccess(Object.keys(dings)))
    },(error)=>dispatch(settingDingListenerError(error)))
  }
}

const initialState=fromJS({
  isFetching:false,
  error:'',
  dingIds:[],
})

export default function dingFeed(state=initialState,action){
  switch(action.type){
    case SETTING_DING_LISTENER:
      return state.merge({
        isFetching : true
      })
    case SETTING_DING_LISTENER_ERROR:
      return state.merge({
        isFetching: false,
        error:action.error
      })
    case SETTING_DING_LISTENER_SUCCESS:
      return state.merge({
        isFetching:false,
        error:'',
        dingIds : action.dingIds
      })
    default:
      return state
    }
}