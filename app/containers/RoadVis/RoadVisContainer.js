// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RoadVis } from 'components';
import * as roadsActionCreators from 'modules/roads';

class RoadVisContainer extends React.Component {
  props: {
    roadId: string
  }
  render () {
    return (<RoadVis roadId={this.props.roadId}/>);
  }
}

function mapStateToProps (state, props) {
  const roadId = props.params.roadId;
  return {
    roadId,
  };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
  return bindActionCreators({
    ...roadsActionCreators,
  }, dispatch);
}

export default connect(mapStateToProps,
  mapDispatchToProps)(RoadVisContainer);
