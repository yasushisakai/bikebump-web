var React = require('react');
var PropTypes = React.PropTypes;
var getLocation = require('../utilities/GeoLocationHelpers');

var Question = function(props){
      return(
        <div className="questionText">{props.text}</div>
      )
  }

Question.PropTypes = {
	text : PropTypes.string.isRequired
};

module.exports = Question;
