import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as usersActionCreator from 'modules/users'
import { tileURL, attribution, img_root } from 'config/constants'
import { MapVis } from 'components'
import leaflet from 'leaflet'


const MapVisContainer = React.createClass({
  componentDidMount(){
    this.map = leaflet.map('mainMap').setView([51.5,-0.09],13)
    leaflet.tileLayer(tileURL,{attribution,maxZoom:17}).addTo(this.map)
  },
  render () {
    return (
      <MapVis/>
    )
  },
})

function mapStateToProps (state) {
  return {
    isFetching:state.users.get('isFetching')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(usersActionCreator,dispatch)
}

export default connect(mapStateToProps, 
mapDispatchToProps)(MapVisContainer)