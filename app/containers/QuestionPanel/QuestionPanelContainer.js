import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as questionsActionCreator from 'modules/questions';
import {questionPanel, text, options, singleOption} from './styles.css';
import { Map } from 'immutable';

const QuestionPanelContainer = React.createClass({
  propTypes: {
    nextResponsePair: PropTypes.array.isRequired,
    onClickOption: PropTypes.func.isRequired,
    questionId: PropTypes.string,
    question: PropTypes.instanceOf(Map),
  },
  onClickOption (index) {
    this.forceUpdate();
    return this.props.onClickOption(index);
  },
  formatOptions (options) {
    const optionStyle = {};

    return options.map((option, index) => {
      return <div className={singleOption} onClick={() => this.props.onClickOption(index)} key={index}>{option}</div>;
    });
  },
  render () {
    return this.props.question === undefined || this.props.questionId === undefined
      ? null
      : (
        <div className={questionPanel}>
          <div className={text}>{this.props.question.get('questionText')}</div>
          <div className={options}>{this.formatOptions(this.props.question.get('values').toJS())}</div>
        </div>
      );
  },
});

function mapStateToProps (state, props) {
  return {
    question: state.questions.get(props.questionId),
    nextResponsePair: state.userResponses.get('nextResponsePair'),
  };
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(questionsActionCreator, dispatch);
}

export default connect(mapStateToProps,
  mapDispatchToProps)(QuestionPanelContainer);
