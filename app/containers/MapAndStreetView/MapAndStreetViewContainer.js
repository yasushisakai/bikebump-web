import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { contents } from 'styles/styles.css'
import { Map } from 'immutable'
import { lightURL } from 'config/constants'
import leaflet from 'leaflet'
// import mapzen from 'mapzen.js'
import { icon, defaultStyle } from 'helpers/mapUtils'
import { isModuleStale } from 'helpers/utils'

import * as dingActionCreators from 'modules/dings'

const MapAndStreetViewContainer = React.createClass({
  propTypes: {
    latestFetchAttempt: PropTypes.number.isRequired,
    latestLocation: PropTypes.object.isRequired,

    isFetching: PropTypes.bool.isRequired,
    dingId: PropTypes.string.isRequired,
    ding: PropTypes.instanceOf(Map),

    handleFetchingDing: PropTypes.func.isRequired,
  },
  componentWillMount () {
    // fetching
    this.props.handleFetchingDing(this.props.dingId)
  },
  componentDidMount () {
    // init map
    let position
    if (isModuleStale(this.props.latestFetchAttempt)) {
      // latest location fetch was long ago
      position = [42.3602747, -71.0872227]
    } else {
      // fresh location!
      position = [
        parseFloat(this.props.latestLocation.lat),
        parseFloat(this.props.latestLocation.lng),
      ]
    }

    this.map = leaflet.map('tinyMap', {zoomControl: false}).setView(position, 18)

    leaflet.tileLayer(lightURL, { maxZoom: 20 }).addTo(this.map)

    if (!this.props.isFetching) {
      // sometimes component never updates after mounting
      this.drawCircles(this.props)
    }
  },
  componentWillReceiveProps (nextProps) {
    if (this.props.dingId !== nextProps.dingId) {
      this.props.handleFetchingDing(nextProps.dingId)
    }
  },
  shouldComponentUpdate (nextProps) {
    // only draw when
    return !nextProps.isFetching || (this.props.dingId !== nextProps.dingId)
  },
  componentWillUpdate (nextProps) {
    console.log('mapStreet', 'cwu', nextProps.dingId)
    if (!nextProps.isFetching) {
      this.drawCircles(nextProps)
    }
  },
  componentWillUnmount () {
    this.map.remove()
  },
  drawCircles (props) { // also focuses the map to the report
    const coordinate = props.ding.get('coordinates').toJS()
    this.map.panTo(coordinate)

    // remove previous dings

    if (this.reportedLocation) this.map.removeLayer(this.reportedLocation)
    if (this.closestRoad) this.map.removeLayer(this.closestRoad)

    // draw the dings
    this.reportedLocation = leaflet.circle(
        coordinate,
        props.ding.get('radius'),
        {...defaultStyle, weight: 1, opacity: 0.5, color: '#f00'}
      ).addTo(this.map)

      // if there is a road, draw that too
    if (props.ding.has('road')) {
      const {x, y} = props.ding.getIn(['road', 'point']).toJS()
      const closestPoint = {lat: y, lng: x}

      this.closestRoad = leaflet.circle(
          closestPoint,
          props.ding.get('radius'),
          {...defaultStyle, weight: 1, opacity: 0.8, color: '#00f'}
        ).addTo(this.map)
    }
  },
  render () {
    return (
      <div id='tinyMap' className={contents} />
    )
  },
})

function mapStateToProps (state, props) {
  const dingId = props.dingId
  const ding = state.dings.get(dingId)
  return {
    latestLocation: state.record.get('latestLocation').toJS(),
    latestFetchAttempt: state.record.get('latestFetchAttempt'),

    isFetching: state.dings.get('isFetching') || !ding,
    dingId,
    ding,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(dingActionCreators, dispatch)
}

export default connect(mapStateToProps,
mapDispatchToProps)(MapAndStreetViewContainer)
