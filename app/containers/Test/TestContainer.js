import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Test } from 'components'
import * as patternsActionCreators from 'modules/patterns'
import * as proposalsActionCreators from 'modules/proposals'
import * as questionsActionCreators from 'modules/questions'
import * as responsesActionCreators from 'modules/responses'
import * as userStatsActionCreatros from 'modules/userStats'

const TestContainer = React.createClass({
  propTypes :{
    uid: PropTypes.string.isRequired,
    isFetching : PropTypes.bool.isRequired,
    handleFetchPatterns: PropTypes.func.isRequired,
    handleFetchingProposals: PropTypes.func.isRequired,
    handleFetchingQuestions:  PropTypes.func.isRequired,
    handleFetchingResponses: PropTypes.func.isRequired,
    handleAddProposal : PropTypes.func.isRequired,
    handleAddQuestion : PropTypes.func.isRequired,
    handleAddResponse: PropTypes.func.isRequired,
    handleAddVote: PropTypes.func.isRequired,
    handleRemoveVote: PropTypes.func.isRequired,
    handleFetchingUserStats : PropTypes.func.isRequired,
  },
  contextTypes:{
    router : PropTypes.object.isRequired,
  },
  componentDidMount(){
    // fetchin' a bunch
    console.log(this.context.router)
    this.props.handleFetchPatterns()
    this.props.handleFetchingProposals()
    this.props.handleFetchingQuestions()
    this.props.handleFetchingResponses()
    this.props.handleFetchingUserStats()

    const proposal = {
      patternId:"-KbMbV6KN6h0C3QDyoyI",
      roadId:8813981,
      domain:{start:0.1,end:0.6},
    }

    //this.props.handleAddProposal(proposal)

    // samples
    const question = {
      questionText: 'how is your riding experience',
      values:['Good','Bad']
    }

    const response = {
      questionId: '-KbQI8K7Upvsg7f4TD8x',
      dingId : '-KbMikLDixaHNHc1-qf-',
      value: 0
    }
  },
  handleClick () {
    const uid = this.props.uid
    const roadId = 8813981
    const proposalId = '-KbRQ2NIpXecf10Bj7Zz'
    this.props.handleAddVote(uid,roadId,proposalId)
    this.props.handleRemoveVote(uid,roadId,proposalId)
  },
  render () {
    return this.props.isFetching === true
      ? null
      : <Test onClick={this.handleClick}/>
  },
})

function mapStateToProps ({users,patterns,proposals,questions,responses}) {
  return {
    isFetching : 
      patterns.get('isFetching') || 
      proposals.get('isFetching') ||
      questions.get('isFetching') ||
      responses.get('isFetching') ||
      users.get('isFetching')
      ,
    uid: users.get('authedId') 
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      ...patternsActionCreators,
      ...proposalsActionCreators,
      ...questionsActionCreators,
      ...responsesActionCreators,
      ...userStatsActionCreatros,
    },dispatch)
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps 
)(TestContainer)