import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { Respond } from 'components'
import * as userDingsActionCreators from 'modules/userDings'
import * as questionsActionCreators from 'modules/questions'
import * as userResponsesActionCreators from 'modules/userResponses'
import * as responsesActionCreators from 'modules/responses'
import * as dingFeedActionCreators from 'modules/dingFeed'

const RespondContainer = React.createClass({
  propTypes:{
    hasUnanswered: PropTypes.bool.isRequired,
    userDings: PropTypes.instanceOf(Map).isRequired,
    questions: PropTypes.instanceOf(Map).isRequired,
    userResponses : PropTypes.instanceOf(Map).isRequired,

    handleFetchingUserDings : PropTypes.func.isRequired,
    handleFetchingUserResponses : PropTypes.func.isRequired,
    handleFetchingQuestions : PropTypes.func.isRequired,
    handleSetDingListener:PropTypes.func.isRequired,
    handleAddResponse:PropTypes.func.isRequired,

    setNextResponse:PropTypes.func.isRequired,
    setHasUnanswered: PropTypes.func.isRequired,
  },
  contextTypes:{
    router: PropTypes.object.isRequired,
  },
  componentDidMount(){

    // let's assume that we have questions dings and responses

    this.props.handleSetDingListener()

    const promises = [
      this.props.handleFetchingQuestions(),
      this.props.handleFetchingUserResponses(this.props.uid),
      this.props.handleFetchingUserDings(this.props.uid),
    ]


    Promise.all(promises)
      .then(()=>{
        this.props.setHasUnanswered(this.setNewQuestion(false,false))
      })


  },
  setNewQuestion(isRandom=false,deleteCurrent=true){
    const completeList = this.createCompleteListOfPossibleResponses()
    const extractedList = this.extractUnansweredResponses(completeList,deleteCurrent)

    if(extractedList.length === 0) return false

    let pair;
    if(isRandom){
      pair=extractedList[Math.floor(Math.random()*extractedList.length)]
    }else{
      pair=extractedList[0]
    }

    this.targetDingId = pair[0]
    this.questionId = pair[1]

    this.props.setNextResponse(pair)

    return true

  },
  createCompleteListOfPossibleResponses(){
    let exhaustiveList = {}
    this.props.userDings.keySeq().toArray().map(dingId=>{
      exhaustiveList[dingId] = []
      this.props.questions
      .keySeq()
      .toArray()
      .filter(qid=>(qid !== 'isFetching' && qid !== 'error' && qid !== 'lastUpdated'))
      .map(qId=>{
        exhaustiveList[dingId].push(qId)
      })
    })
    return exhaustiveList
  },
  extractUnansweredResponses(responseList,deleteCurrent){
    let unansweredResponses = []
    Object.keys(responseList).map(dingId=>{
      responseList[dingId].map(qId=>{
        if(this.props.userResponses.getIn([dingId,qId]) === undefined){
          if(deleteCurrent){
            if(!(dingId===this.props.nextPair[0] && qId===this.props.nextPair[1])){
              unansweredResponses.push([dingId,qId])
            }
          }else{
            unansweredResponses.push([dingId,qId])
          }
        }
      })
    })
    console.log(unansweredResponses.length)
    return unansweredResponses
  },
  handleNext(){
    this.props.setHasUnanswered(this.setNewQuestion(true,false))
  },
  handleOptionClick(index){
    this.props.handleAddResponse({
      dingId:this.props.nextPair[0],
      questionId:this.props.nextPair[1],
      uid: this.props.uid,
      value:index
    })
    console.log({
      dingId:this.props.nextPair[0],
      questionId:this.props.nextPair[1],
      uid: this.props.uid,
      value:index
    })

    console.log(this.props.nextPair)
    this.props.setHasUnanswered(this.setNewQuestion(false))
    //this.context.router.refresh()
    //this.context.router.replace(`/user/${this.props.uid}/respond`)
    // replace(`/user/${this.props.uid}/respond`)
    // window.location.reload() <- works but not sufficient
    // this.props.replace('/')
    console.log(this.props.nextPair)
    this.forceUpdate()
  },
  render () {
    return this.props.isFetching 
    ? null
    : (<Respond 
      hasUnanswered={this.props.hasUnanswered}
      onClickNext={this.handleNext} 
      onClickOption={this.handleOptionClick}
      dingId={this.targetDingId}
      questionId={this.questionId}
      />)
  }
})

function mapStateToProps (state,props) {
    const uid = props.params.uid
  return {
    hasUnanswered:state.userResponses.get('hasUnanswered'),
    isFetching: state.userDings.get('isFetching') || state.userResponses.get('isFetching') || state.questions.get('isFetching'),
    uid,
    nextPair : state.userResponses.get('nextResponsePair'),
    dings: state.dings || new Map(),
    userDings : state.userDings.get(uid) || new Map(),
    questions : state.questions || new Map(),
    userResponses : state.userResponses.get(uid) || new Map(),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...userDingsActionCreators,
    ...questionsActionCreators,
    ...userResponsesActionCreators,
    ...dingFeedActionCreators,
    ...responsesActionCreators,
  },dispatch)
}

export default connect(mapStateToProps,mapDispatchToProps)(RespondContainer)