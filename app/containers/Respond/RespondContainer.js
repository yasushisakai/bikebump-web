// @flow
import React, { PropTypes } from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Respond } from 'components';

import { extractActionCreators, getUnansweredQueries, pickNewQuery, removeQuery } from 'helpers/utils';

import * as userDingsActionCreators from 'modules/userDings';
import * as questionsActionCreators from 'modules/questions';
import * as userResponsesActionCreators from 'modules/userResponses';
import * as responsesActionCreators from 'modules/responses';

import type {Ding, Question, Response} from 'types';

type Props = {
    // info need for this container
    uid: string;
    questions: Map<string, Question>;
    userDings: Map<string, Ding>;
    userResponses: Map<string, Response>;
    nextPair: ?Map<any, any>;
    hasUnanswered: boolean;
    isFetching: boolean;

    // functions to fetch info we need
    handleFetchingQuestions: Function;
    handleFetchingUserDings: Function;
    handleFetchingUserResponses: Function;

    // function to register pair
    setNextQuery: Function;
    setHasUnanswered: Function;

    // for responding
    handleAddResponse: Function;
  }

class RespondContainer extends React.Component<void, Props, void> {
  contextTypes: {
    router: PropTypes.object.isRequired;
  }
  constructor (props) {
    super(props);
    this.handleNextQuery = this.handleNextQuery.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }
  componentWillMount () {
    // fetching info!
    // we need the question list, userResponses, and userDings
    this.props.handleFetchingQuestions();
    this.props.handleFetchingUserResponses(this.props.uid);
    this.props.handleFetchingUserDings(this.props.uid);
  }

  shouldComponentUpdate (nextProps: Props) {
    //    return !nextProps.isFetching
    return true;
  }

  componentWillUpdate (nextProps: Props) {
    console.log('cwu', nextProps.isFetching);

    const nextPair: Map<any, any> = this.props.nextPair ? ((this.props.nextPair:any): Map<any, any>) : new Map();

    if (!nextProps.isFetching && nextPair.get('dingId') === '') {
      this.handleNextQuery(nextProps.questions, nextProps.userDings, nextProps.userResponses);
    }
  }

  handleNextQuery: Function;
  handleRefresh: Function;
  handleOptionClick: Function;

  handleNextQuery (questions, userDings, userResponses, isRandom = false, excludeCurrent = false) {
    let unAnswered = getUnansweredQueries(questions, userDings, userResponses);

    // exclude current next pair
    if (excludeCurrent) {
      if (unAnswered.isEmpty()) {
        this.props.setHasUnanswered(false);
        return;
      } else {
        const nextPair = this.props.nextPair ? this.props.nextPair.toJS() : {dingId: '', questionId: ''};
        const {dingId, questionId} = nextPair;
        unAnswered = removeQuery(unAnswered, dingId, questionId);
      }
    }

    if (unAnswered.isEmpty()) {
      this.props.setHasUnanswered(false);
    } else {
      this.props.setHasUnanswered(true);
      let newQuery = pickNewQuery(unAnswered, isRandom);
      if (newQuery) {
        const {dingId, questionId} = newQuery.toJS();
        this.props.setNextQuery(dingId, questionId);
      }
    }
  }

  handleRefresh () {
    // console.log('refresh!')
    window.navigator.vibrate(50);
    const {questions, userDings, userResponses} = this.props;
    this.handleNextQuery(questions, userDings, userResponses, true);
  }

  handleOptionClick (index) {
    if (this.props.hasUnanswered) {
      const nextPair = this.props.nextPair ? this.props.nextPair.toJS() : {dingId: '', questionId: ''};
      const {dingId, questionId} = nextPair;
      // console.log(`userId: ${ this.props.uid }, dingId: ${ dingId }, questionId: ${ questionId } index: ${index }`)
      window.navigator.vibrate(50);

      console.log(this.props.questions.getIn([questionId, 'values', index, 'value']));

      this.props.handleAddResponse({
        dingId,
        questionId,
        uid: this.props.uid,
        value: this.props.questions.getIn([questionId, 'values', index, 'value']),
      });

      const {questions, userDings, userResponses} = this.props;
      this.handleNextQuery(questions, userDings, userResponses, false, true);
    }
  }

  render () {
    // const dingId = '-KdfdFnJIhhpXBEfpSJa'
    // const questionId = '-KbuetTkYHqA5cGSNHDO'

    if (this.props.hasUnanswered) {
      const nextPair = this.props.nextPair ? this.props.nextPair.toJS() : {dingId: '', questionId: ''};
      const {dingId, questionId} = nextPair;
      return this.props.isFetching || dingId === ''
        ? <div> {'Loading question'} </div>
        : <Respond
          dingId={dingId}
          questionId={questionId}
          clickOption={this.handleOptionClick}
          clickRefresh={this.handleRefresh}/>;
    } else {
      return <div> {'no questions to be answered'} </div>;
    }
  }
}

function mapStateToProps (state, props) {
  const uid = props.params.uid;
  const userDings = state.userDings.get(uid);
  const userResponses = state.userResponses.get(uid);
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
    questions: state.questions,
    hasUnanswered: state.userResponses.get('hasUnanswered'),
    nextPair: state.userResponses.get('nextPair'),
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    ...extractActionCreators(questionsActionCreators),
    ...extractActionCreators(userResponsesActionCreators),
    ...extractActionCreators(userDingsActionCreators),
    ...extractActionCreators(responsesActionCreators),
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RespondContainer);
