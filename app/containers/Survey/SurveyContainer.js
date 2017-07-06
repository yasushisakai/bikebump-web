// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Map } from 'immutable';
import {
    btn,
    icon,
    other,
    qwrapper,
    qbuttons,
    qtextbox,
    qtext,
    qoptions,
} from './styles.css';
import RefreshIcon from 'react-icons/lib/fa/refresh';
import QuestionIcon from 'react-icons/lib/fa/question';
import type { Question } from 'types';
import { Option } from 'components';

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
    constructor (props) {
        super(props);
        this.getOptionSize = this.getOptionSize.bind(this);
    }
    componentWillMount () {
    // this.props.handleFetchingSingleQuestion(this.props.questionId)
    // FIXME: Hardcoding
        this.optionsWidth = window.innerWidth * 0.8;
        this.optionsHeight = window.innerHeight * 0.192;
    }
    componentDidMount () {
        console.log('hi, there');
        const optionsElement = document.getElementById('options');
        if (optionsElement) {
            this.optionsWidth = optionsElement.clientWidth;
            this.optionsHeight = optionsElement.clientHeight;
        }
    }

  optionsWidth: number;
  optionsHeight: number;
  optionSize: number;

  getOptionSize: Function;

  getOptionSize () {
        const optionNum = this.props.question.values.length;
        console.log(this.optionsWidth, this.optionsHeight);
        const unitHeight = this.optionsHeight - 5;
        const unitWidth = this.optionsWidth * (1 - ((optionNum - 1) * 0.05)) / optionNum;
        console.log(unitWidth, unitHeight);
        this.optionSize = unitHeight < unitWidth ? unitHeight : unitWidth;
    }

  renderQuestionOptions () {
        this.getOptionSize();
        return this.props.question.values.map((option, index) =>
            <Option
                size={this.optionSize}
                label={option.label}
                color={option.color}
                background={option.background} // FIXME
                otherResponses={10}
                key={index}
                onClick={() => this.props.onClickOption(index)}/>
        );
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
                        <div id={'options'} className={qoptions}>
                            { this.renderQuestionOptions() }
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
