import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { qwrapper, qtext, qoptions, qoption, items2, items3, items4 } from './styles.css'
const items = [items2, items3, items4]

import * as questionActionCreators from 'modules/questions'

const SurveyContainer = React.createClass({
  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    questionId: PropTypes.string.isRequired,
    question: PropTypes.object,

    onClickOption: PropTypes.func.isRequired,
    handleFetchingSingleQuestion: PropTypes.func.isRequired,
  },
  componentWillMount () {
    // this.props.handleFetchingSingleQuestion(this.props.questionId)
  },
  renderOptions (questionOptions) {
    const options = questionOptions.toArray()
    const classNameForOption = `${qoption} ${items[options.length - 2]}`
    return options.map((option, index) => {
      return <div className={classNameForOption} onClick={() => this.props.onClickOption(index)} key={index}>{ option }</div>
    })
  },
  render () {
    const itemSize = 2
    const optionStyle = `${items[itemSize - 2]} ${qoption}`

    return this.props.isFetching
    ? <div> {'Loading Question'} </div>
    : (
    <div className={qwrapper}>
      <div className={qtext}>
      { this.props.question.get('questionText') }
      </div>
      <div className={qoptions}>
        { this.renderOptions(this.props.question
        .get('values'))}
      </div>
    </div>
    )
  },
})

function mapStateToProps (state, props,) {
  const questionId = props.questionId
  const question = state.questions.get(questionId)

  return {
    isFetching: state.questions.get('isFetching') || !question,
    questionId,
    question: state.questions.get(questionId) || new Map(),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(questionActionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyContainer)
