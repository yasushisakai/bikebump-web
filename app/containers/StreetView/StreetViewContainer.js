import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { Map } from 'immutable'
import { connect } from 'react-redux'
import { formatGoogleStreetViewURL} from 'helpers/utils'

import * as dingActionCreators from 'modules/dings'

const StreetViewContainer = React.createClass({
  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    dingId: PropTypes.string,
    ding: PropTypes.instanceOf(Map).isRequired,
    handleFetchingDing: PropTypes.func.isRequired,
  },
  googleStreetViewTag () {
    if (this.props.dingId !== '' && this.props.ding !== new Map()) {
      let url
      if (this.props.ding.has('closestRoadPoint')) {
        url = formatGoogleStreetViewURL(this.props.ding.get('closestRoadPoint').toJS())
      } else {
        url = formatGoogleStreetViewURL(this.props.ding.get('coordinates').toJS())
      }
      return {height: '100%', background: `url(${url}) center center no-repeat`, backgroundSize: 'cover'}
    } else {
      return {}
    }
  },
  render () {
    return <div style={this.googleStreetViewTag()} />
  },
})

function mapStateToProps (state, props) {
  return {
    isFetching: state.dings.get('isFetching') || state.dingFeed.get('isFetching'),
    dingId: props.dingId,
    ding: state.dings.get(props.dingId) || new Map(),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...dingActionCreators,
  }, dispatch)
}

export default connect(mapStateToProps,
mapDispatchToProps)(StreetViewContainer)
