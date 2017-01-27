import { initialState } from 'config/constants'
import { fetchAll, save } from 'helpers/api'

const FETCHING_QUESTIONS = 'FETCHING_QUESTIONS'
const FETCHING_QUESTIONS_ERROR = 'FETCHING_QUESTIONS_ERROR'
const FETCHING_QUESTIONS_SUCCESS = 'FETCHING_QUESTIONS_SUCCESS'

const ADD_QUESTION = 'ADD_QUESTION'
const ADD_QUESTION_ERROR = 'ADD_QUESTION_ERROR'


function fetchingQuestions () {
  return{
    type:FETCHING_QUESTIONS,
  }
}

function fetchingQuestionsError (error) {
  console.warn(error)
   return{
    type:FETCHING_QUESTIONS_ERROR,
    error: 'error fetching questions'
  }
}

function fetchingQuestionsSuccess (questions) {
   return{
    type:FETCHING_QUESTIONS_SUCCESS,
    questions
  }
}

export function handleFetchingQuestions (){
  return function(dispatch){
    dispatch(fetchingQuestions())
    fetchAll('questions')
      .then((questions)=>dispatch(fetchingQuestionsSuccess(questions)))
      .catch((error)=>dispatch(fetchingQuestionsError(error)))
  }
} 

function addQuestion (question) {
  return{
    type:ADD_QUESTION,
    question
  }
}

function addQuestionError (error) {
  console.warn(error)
  return{
    type:ADD_QUESTION_ERROR,
    error:'error adding Question'
  }
}

export function handleAddQuestion (question) {
  return function(dispatch) {
    save('questions',question)
      .then((questionWithId)=>dispatch(addQuestion(question)))
      .catch((error)=>dispatch(addQuestionError(error)))
  }
}

export default function questions (state=initialState, action){
  switch (action.type) {
    case FETCHING_QUESTIONS:
      return state.set('isFetching',true)
    case FETCHING_QUESTIONS_SUCCESS:
      return state.merge({
        isFetching:false,
        error:''
      }).merge(action.questions)
    case ADD_QUESTION_ERROR:
    case FETCHING_QUESTIONS_ERROR:
      return state.merge({
        isFetching:false,
        erro:action.error
      })
    case ADD_QUESTION:
      return state.merge({
        isFetching:false,
        error:'',
        [action.question.questionId]:action.question
      })
    default:
      return state
  }
}