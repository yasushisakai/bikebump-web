// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Map } from 'immutable';
import { btn, icon, other, qwrapper, qbuttons, qtextbox, qtext, qoptions, qoption, qoptiontext, items2, items3, items4 } from './styles.css';
import RefreshIcon from 'react-icons/lib/fa/refresh';
import QuestionIcon from 'react-icons/lib/fa/question';
import type { Question } from 'types';
import { Option } from 'components';

const items = [items2, items3, items4];

import * as questionActionCreators from 'modules/questions';

  type Props = {
    isFetching: boolean;
    questionId: string;
    question: Question;

    onClickOption: Function;
    onClickRefresh: Function;
    handleFetchingSingleQuestion: Function;
  }

class SurveyContainer extends React.Component<void, Props, void> {
  componentWillMount () {
    // this.props.handleFetchingSingleQuestion(this.props.questionId)
  }
  renderOptions (questionOptions: Array<string>) {
    const classNameForOption = `${qoption} ${items[questionOptions.length - 2]}`;
    return questionOptions.map((option, index) => {
      return (<div className={classNameForOption} onClick={() => this.props.onClickOption(index)} key={index}>
        <span className={qoptiontext}>{ option }</span>
      </div>
      );
    });
  }
  render () {
    return this.props.isFetching
      ? <div> {'Loading Question'} </div>
      : (
        <div className={qwrapper}>
          <div className={qtextbox}>
            <span className={qtext}>{ this.props.question.questionText }</span>
          </div>
          <div className={qbuttons}>
            <div className={qoptions}>
              { this.renderOptions(this.props.question.values) }
            </div>
            <div className={other}>
              <div className={btn}>
                <Link to='/record'><QuestionIcon className={icon}/></Link>
              </div>
              <div className={btn} onClick={this.props.onClickRefresh}>
                <RefreshIcon className={icon}/>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

function mapStateToProps (state, props) {
  const questionId = props.questionId;
  const rawQuestion: Map<any, any> = state.questions.get(questionId) || new Map();

  return {
    isFetching: state.questions.get('isFetching') || !rawQuestion,
    questionId,
    question: rawQuestion.toJS(),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators(questionActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyContainer);
