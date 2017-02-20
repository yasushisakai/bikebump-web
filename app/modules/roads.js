import { fromJS } from 'immutable'
import { fetchRoad, fetchRoads } from 'helpers/api'
const FETCHING_ROAD = 'FETCHING_ROAD'
const FETCHING_ROAD_ERROR = 'FETCHING_ROAD_ERROR'
const FETCHING_ROAD_SUCCESS = 'FETCHING_ROAD_SUCCESS'
const FETCH_SINGLE_ROAD = 'FETCH_SINGLE_ROAD'

const initialState = fromJS({
  isFetching:false,
  lastUpdated:0,
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

function fetchSingleRoad(roadId,road){
  return {
    type:FETCH_SINGLE_ROAD,
    roadId,
    road
  }
}

export function handleFetchSingleRoad(roadId){
  return function (dispatch){
    dispatch(fetchingRoad())
    return fetchRoad(roadId)
      .then(road => dispatch(fetchSingleRoad(roadId,road)))
      .catch(error => dispatch(fetchingRoadError(error)))
  }
}

// lets get the roads once
function fetchingRoadSuccess (roads) {
  return {
    type:FETCHING_ROAD_SUCCESS,
    roads
  }
}
// fetch road

export function handleFetchingRoads () {
  return function(dispatch,getState){
    if(getState().roads.get('isFetching')) return
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
        error:'',
        lastUpdated: Date.now(),
      })
    case FETCH_SINGLE_ROAD:
    return state.merge({
      isFetching:false,
      [action.roadId]:action.road,
    })
    default:
      return state
  }
}