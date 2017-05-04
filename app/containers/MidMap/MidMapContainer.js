import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import { spliceRoad } from 'helpers/utils'
import { tileURL, attribution} from 'config/constants'
import { mapContents } from './styles.css'
import * as roadActionCreators from 'modules/roads'
import * as proposalsActionCreators from 'modules/proposals'
import * as patternsActionCreators from 'modules/patterns'
import * as userVotesActionCreators from 'modules/userVotes'
import {plotRoad, plotPolyline, roadLineStringToLatLngBound, plotDing, popUpButtonStyleDisabled, popUpButtonStyleEnabled} from 'helpers/mapUtils'
import leaflet from 'leaflet'

const MidMapContainer = React.createClass({
  propTypes: {
    roadId: PropTypes.number.isRequired,
    latestLocation: PropTypes.object.isRequired,
    proposals: PropTypes.instanceOf(Map).isRequired,
    patterns: PropTypes.instanceOf(Map).isRequired,
    userVotes: PropTypes.object.isRequired,

    handleFetchSingleRoad: PropTypes.func.isRequired,
    handleFetchingPatterns: PropTypes.func.isRequired,
    handleFetchingProposals: PropTypes.func.isRequired,
    handleFetchingUserVotes: PropTypes.func.isRequired,
    handleAddVote: PropTypes.func.isRequired,
  },
  componentDidMount () {
    this.props.handleFetchingPatterns()
    this.props.handleFetchingProposals(this.props.roadId)
    this.props.handleFetchSingleRoad(this.props.roadId)
    if (this.props.authedId) { this.props.handleFetchingUserVotes(this.props.authedId) }

    // map
    let location = []
    if (this.props.latestLocation.lat === 0) {
      location = [42.355596, -71.101363]
    } else {
      const {lat, lng} = this.props.latestLocation
      location = [lat, lng]
    }

    this.map = leaflet.map('midMap').setView(location, 17)

    leaflet.tileLayer(tileURL, {attribution}).addTo(this.map)

    // fetch road
    if (this.props.road === undefined) {
      this.props.handleFetchSingleRoad(this.props.roadId)
        .then(({road}) => {
          plotRoad(road, this.map)
          const bound = roadLineStringToLatLngBound(road)
          this.map.fitBounds(bound)
        })
    } else {
      plotRoad(this.props.road.toJS(), this.map)
      const bound = roadLineStringToLatLngBound(this.props.road.toJS())
      this.map.fitBounds(bound)
    }

    // dings
    if (this.props.dings !== undefined) {
      this.props.dings.keySeq().toArray()
      .filter(key => key !== 'isFetching' && key !== 'error' && key !== 'lastUpdated')
      .filter((key) => {
        return this.props.dings.getIn([key, 'roadId']) === this.props.roadId
      })
      .map(key => {
        plotDing(this.props.dings.get(key).toJS(), this.map)
      })
    }
  },
  componentWillUnmount () {
    this.map.remove()
  },
  getPopupContents (proposal, callback) {
    const pattern = this.props.patterns.get(proposal.get('patternId'))
    const budget = pattern.get('budget')
    const text = pattern.get('text')
    let container = document.createElement('div')
    container.style = 'font-size:1.8em;'
    container.innerHTML = `<h1>${text}</h1>$${budget}/ft`
    let button = document.createElement('button')
    if (proposal.get('proposalId') === this.props.userVotes.get(`${this.props.roadId}`)) {
      button.style = popUpButtonStyleEnabled
    } else {
      button.style = popUpButtonStyleDisabled
    }

    button.innerHTML = '<i class="fa fa-star" aria-hidden="true"></i>'
    // button.text='hello'
    button.addEventListener('click', () => {
      if (proposal.get('proposalId') === this.props.userVotes.get(`${this.props.roadId}`)) {
        // remove
        button.style = popUpButtonStyleDisabled
        return this.props.handleRemoveVote(this.props.authedId, this.props.roadId, proposal.get('proposalId'))
      }
      button.style = popUpButtonStyleEnabled
      return this.props.handleAddVote(this.props.authedId, this.props.roadId, proposal.get('proposalId'))
    }
    )
    container.appendChild(button)
    return container
  },
  componentWillUpdate () {
    this.map.invalidateSize()
  },
  render () {
    if (!this.props.isFetching && this.props.road !== undefined && this.map) {
      let cnt = 0
      this.props.proposals.map((obj, idx) => {
        const spliced = spliceRoad(
            this.props.road.get('geometry').toJS(),
            {...obj.get('domain').toJS(), index: 0})
          .map(coord => {
            const shifted = {lat: parseFloat(coord.lat) + 0.0001 * cnt, lng: parseFloat(coord.lng) + 0.0000 * cnt}
            return shifted
          })
        plotPolyline(spliced, this.map).bindPopup(this.getPopupContents(obj))
        cnt++
      })
    }
    return (
        <div id='midMap' className={mapContents} />
    )
  },
})

function mapStateToProps (state, props) {
  const roadId = parseInt(props.roadId)
  const authedId = state.users.get('authedId')
  return {
    isFetching: state.roads.get('isFetching') || state.patterns.get('isFetching') || state.proposals.get('isFetching') || state.users.get('isFetching'),
    authedId,
    dings: state.dings,
    patterns: state.patterns || new Map(),
    proposals: state.proposals.get(`${roadId}`) || new Map(),
    roadId,
    road: state.roads.get(`${roadId}`),
    latestLocation: state.record.get('latestLocation').toJS(),
    userVotes: state.userVotes.get(authedId) || new Map(),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...roadActionCreators,
    ...patternsActionCreators,
    ...proposalsActionCreators,
    ...userVotesActionCreators,
  }, dispatch)
}

export default connect(mapStateToProps,
mapDispatchToProps)(MidMapContainer)
