import { fromJS } from 'immutable' 
import { listenToDings } from 'helpers/api'
import { addListener } from 'modules/listeners'
import { addMultipleDings, removeFetching } from 'modules/dings'

const SETTING_DING_LISTENER = 'SETTING_DING_LISTENER'
const SETTING_DING_LISTENER_ERROR = 'SETTING_DING_LISTENER_ERROR'
const SETTING_DING_LISTENER_SUCCESS = 'SETTING_DING_LISTENER_SUCCESS'
const REMOVE_FEED_FETCHING = 'REMOVE_FEED_FETCHING'

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

function removeFeedFetching (){
  return {
    type: REMOVE_FEED_FETCHING,
  }
}

export function handleSetDingListener () {
  return function (dispatch,getState) {

    dispatch(settingDingListener())

    if(getState().listeners.get('dings')===true){
      return Promise.resolve(removeFeedFetching())
    }

    dispatch(addListener('dings'))
    return listenToDings((dings)=>{
      dispatch(settingDingListenerSuccess(Object.keys(dings)))
      dispatch(removeFetching())
      return dispatch(addMultipleDings(dings))
    },(error)=>dispatch(settingDingListenerError(error)))
  }
}

const initialState=fromJS({
  isFetching: true,
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
    case REMOVE_FEED_FETCHING:
      return state.set('isFetching',false)
    default:
      return state
    }
}