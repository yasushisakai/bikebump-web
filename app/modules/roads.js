import { fromJS } from 'immutable'
const FETCHING_ROAD = 'FETCHING_ROAD'
const FETCHING_ROAD_ERROR = 'FETCHING_ROAD_ERROR'
const FETCHING_ROAD_SUCCESS = 'FETCHING_ROAD_SUCCESS'

const initialState = fromJS({
  isFetching:false,
  error:''
})

function fetchingRoad () {
  return {
    type:FETCHING_ROAD
  }
}

function fetchingRoadError () {
  return {
    type:FETCHING_ROAD_ERROR
  }
}

function fetchingRoadSuccess () {
  return {
    type:FETCHING_ROAD_SUCCESS
  }
}

export default function roads (state=initialState,action){
  switch (action.type) {
    case FETCHING_ROAD:
      return state.set('isFetching',true)
    case FETCHING_ROAD_ERROR:
      return state.merge({
        isFetching:false,
        error:action.error,
      })
    case FETCHING_ROAD_ERROR:
      return state
    case FETCHING_ROAD_SUCCESS:
      return state
    default:
      return state
  }
}