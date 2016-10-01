var React = require('react');
var PropTypes = React.PropTypes;

var Option = React.createClass({
  PropTypes:{
    text:PropTypes.string
  },
  getInitialState:function(){
    return{
      text: this.props.text
    }
  },
  render:function(){
  return(
    //<div className="option">{this.props.text}</div>
    <button type='button'>{this.props.text}</button>
  )
}
});

module.exports = Option;
