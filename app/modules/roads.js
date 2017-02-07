import { fromJS } from 'immutable'
import { fetchRoad, fetchRoads } from 'helpers/api'
const FETCHING_ROAD = 'FETCHING_ROAD'
const FETCHING_ROAD_ERROR = 'FETCHING_ROAD_ERROR'
const FETCHING_ROAD_SUCCESS = 'FETCHING_ROAD_SUCCESS'

const initialState = fromJS({
  isFetching:true,
  error:''
})

function fetchingRoad () {
  return {
    type:FETCHING_ROAD
  }
}

function fetchingRoadError (error) {
  console.warn(error)
  return {
    type:FETCHING_ROAD_ERROR,
    error : 'error fetching road'
  }
}

// lets get the roads once
function fetchingRoadSuccess (roads) {
  return {
    type:FETCHING_ROAD_SUCCESS,
    roads
  }
}

export function handleRoadsFetch () {
  return function(dispatch){
    dispatch(fetchingRoad())
    return fetchRoads()
      .then((roads)=>dispatch(fetchingRoadSuccess(roads)))
      .catch((error)=>dispatch(fetchingRoadError(error)))
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
    case FETCHING_ROAD_SUCCESS:
      return state.merge(action.roads).merge({
        isFetching:false,
        error:''
      })
    default:
      return state
  }
}