var React = require('react');
var PropTypes = React.PropTypes;
var getLocation = require('../utilities/geolocation');

var Question = React.createClass({
  PropTypes:{
    text:PropTypes.string.isRequired,
  },
  setLatLng:function(position){
		this.setState({
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		})
	  },
  getInitialState:function(){
    return{
      latitude : 999.999,
      longitude: 999.999
    }
  },
  componentDidMount:function(){
		getLocation(this);
  },
  render:function(){
      return(
        <div className="question">
        <div className="questionText">{this.props.text}</div>
          {this.props.children}
          {this.state.latitude === 999.999
						?<div className="questionNoLocation"></div>
						:<div className="questionLocation"> latitude={this.state.latitude}, longitude={this.state.longitude} </div>
					}
        </div>
      )
  }
});

module.exports = Question;
