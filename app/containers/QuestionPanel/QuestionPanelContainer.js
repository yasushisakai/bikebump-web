// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as questionsActionCreator from 'modules/questions';
import {questionPanel, text, options, singleOption} from './styles.css';
import type { Question } from 'types';

type Props = {
    nextResponsePair: Array<string>,
    onClickOption: Function,
    questionId: ?string,
    question: Question,
}

class QuestionPanelContainer extends React.Component<void, Props, void> {
  onClickOption (index) {
    this.forceUpdate();
    return this.props.onClickOption(index);
  }

  formatOptions (options) {
    return options.map((option, index) => {
      return <div className={singleOption} onClick={() => this.props.onClickOption(index)} key={index}>{option}</div>;
    });
  }
  render () {
    return this.props.question === undefined || this.props.questionId === undefined
      ? null
      : (
        <div className={questionPanel}>
          <div className={text}>{ this.props.question.questionText }</div>
          <div className={options}>{ this.formatOptions(this.props.question.values) }</div>
        </div>
      );
  }
}

function mapStateToProps (state, props) {
  return {
    question: state.questions.get(props.questionId).toJS(),
    nextResponsePair: state.userResponses.get('nextResponsePair'),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators(questionsActionCreator, dispatch);
}

export default connect(mapStateToProps,
  mapDispatchToProps)(QuestionPanelContainer);
