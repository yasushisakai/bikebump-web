import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { Respond } from 'components'

import { getUnansweredQueries, pickNewQuery, removeQuery } from 'helpers/utils'

import * as userDingsActionCreators from 'modules/userDings'
import * as questionsActionCreators from 'modules/questions'
import * as userResponsesActionCreators from 'modules/userResponses'
import * as responsesActionCreators from 'modules/responses'

const RespondContainer = React.createClass({
  propTypes:{
    // info need for this container
    uid: PropTypes.string.isRequired,
    questions: PropTypes.instanceOf(Map).isRequired,
    userDings: PropTypes.instanceOf(Map),
    userResponses : PropTypes.instanceOf(Map),
    nextPair: PropTypes.instanceOf(Map),
    hasUnanswered: PropTypes.bool.isRequired,

    // functions to fetch info we need
    handleFetchingQuestions: PropTypes.func.isRequired,
    handleFetchingUserDings : PropTypes.func.isRequired,
    handleFetchingUserResponses : PropTypes.func.isRequired,
  
    // function to register pair
    setNextQuery: PropTypes.func.isRequired,
    setHasUnanswered: PropTypes.func.isRequired,

    // for responding
    handleAddResponse:PropTypes.func.isRequired,
  },
  contextTypes:{
    router: PropTypes.object.isRequired,
  },
  componentWillMount(){
    // fetching info!
    // we need the question list, userResponses, and userDings
    this.props.handleFetchingQuestions()
    this.props.handleFetchingUserResponses(this.props.uid)
    this.props.handleFetchingUserDings(this.props.uid)
  },
  shouldComponentUpdate (nextProps) {
//    return !nextProps.isFetching 
  return true  
  },
  componentWillUpdate (nextProps) {
    console.log('cwu', nextProps.isFetching)

    if(!nextProps.isFetching && this.props.nextPair.get('dingId') === ''){
      const {questions, userDings, userResponses } = nextProps
      this.handleNextQuery(questions, userDings, userResponses)
    }
  },
  handleNextQuery(questions, userDings, userResponses, isRandom = false, excludeCurrent = false){
    let unAnswered = getUnansweredQueries(questions, userDings, userResponses)
    
    // exclude current next pair
    if(excludeCurrent) {
      if(unAnswered.isEmpty()) {
        this.props.setHasUnanswered(false)
        return 
      } else {
        const {dingId, questionId} = this.props.nextPair.toJS()
        unAnswered = removeQuery(unAnswered, dingId, questionId)
      }
    }

    if(unAnswered.isEmpty()){
      this.props.setHasUnanswered(false)
      } else {
      this.props.setHasUnanswered(true)
      const {dingId, questionId} = (pickNewQuery(unAnswered, isRandom).toJS())
      this.props.setNextQuery(dingId, questionId)
    }
  },
  handleRefresh (){
    // console.log('refresh!')
    window.navigator.vibrate(50)
    const {questions, userDings, userResponses} = this.props
    this.handleNextQuery(questions, userDings, userResponses, true) 
  },
  handleOptionClick(index){
    const {dingId, questionId} = this.props.nextPair.toJS()
    // console.log(`userId: ${ this.props.uid }, dingId: ${ dingId }, questionId: ${ questionId } index: ${index }`)
    window.navigator.vibrate(50)

    this.props.handleAddResponse({
      dingId,
      questionId,
      uid: this.props.uid,
      value:index
    })

    const {questions, userDings, userResponses} = this.props
    this.handleNextQuery(questions, userDings, userResponses, false, true) 
  },
  render () {
    //const dingId = '-KdfdFnJIhhpXBEfpSJa'
    //const questionId = '-KbuetTkYHqA5cGSNHDO'
    const {dingId, questionId} = this.props.nextPair.toJS()
    console.log(dingId, questionId)
    return this.props.isFetching || dingId === '' 
    ? <div> {'Loading question'} </div>
    : <Respond 
        dingId={ dingId }
        questionId={ questionId }
        clickOption={ this.handleOptionClick }
        clickRefresh={ this.handleRefresh }
      />
  }
})

function mapStateToProps (state,props) {
    const uid = props.params.uid
    const userDings = state.userDings.get(uid)
    const userResponses = state.userResponses.get(uid)
  return {
    isFetching: ( // we want to make sure everything is set
        state.userDings.get('isFetching') ||
        state.userResponses.get('isFetching') ||
        state.questions.get('isFetching') ||
        !userDings ||
        !userResponses 
      ),
    uid,
    userDings: userDings,
    userResponses,
    questions : state.questions,
    hasUnanswered: state.userResponses.get('hasUnanswered'),
    nextPair: state.userResponses.get('nextPair')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...questionsActionCreators,
    ...userResponsesActionCreators,
    ...userDingsActionCreators,
    ...responsesActionCreators,
  },dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(RespondContainer)
