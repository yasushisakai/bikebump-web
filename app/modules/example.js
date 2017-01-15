import { fromJS } from 'immutable'

import { fetchExample } from 'helpers/api'

const FETCH_EXAMPLE_CONSTANT = 'EXAMPLE_CONSTANT'
const FETCH_EXAMPLE_CONSTANT_ERROR = 'FETCH_EXAMPLE_CONSTANT_ERROR'
const FETCH_EXAMPLE_CONSTANT_SUCCESS = 'FETCH_EXAMPLE_CONSTANT_SUCCESS'

function fetchExampleConstant() {
  return {
    type: FETCH_EXAMPLE_CONSTANT,
    isFetching: true,
  }
}

function fetchExampleConstantError(error) {
  console.warn(error)
  return {
    type: FETCH_EXAMPLE_CONSTANT_ERROR,
    isFetching: false,
    error: 'error fetching example'
  }
}

function fetchExampleConstantSuccess() {
  return {
    type: FETCH_EXAMPLE_CONSTANT_SUCCESS,
    isFetching: false,
  }
}


export function fetchAndhandleExample(){
  return function(dispatch){
      dispatch(fetchExampleConstant()) // sets is fetching to true
      fetchExample() // function from helpers/api.js, resovles in 2seconds
        .then((result)=>dispatch(fetchExampleConstantSuccess()))
        .catch((error)=>dispatch(fetchExampleConstantError(error)))
  }
}

const initialState = fromJS({
  isFetching : false,
  error : ''
})

export default function example(state = initialState,action) {
  switch (action.type) {
   case FETCH_EXAMPLE_CONSTANT :
      return state.merge({
        isFetching:true
      })
  case FETCH_EXAMPLE_CONSTANT_ERROR :
    return state.merge({
      isFetching:false,
      error: action.error
    })
  case FETCH_EXAMPLE_CONSTANT_SUCCESS :
    return state.merge({
      isFetching:false,
    })
  default :
    return state
  }
}