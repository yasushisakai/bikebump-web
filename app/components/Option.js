var React = require('react');
var PropTypes = React.PropTypes;

var Option = React.createClass({
  PropTypes:{
    text:PropTypes.string,
    id:PropTypes.number,
    onClick:PropTypes.func.isReuired,
  },
  render:function(){
  return(
    //<div className="option">{this.props.text}</div>
    <button type='button' onClick={this.props.onClick} >{this.props.text}</button>
  )
}
});

module.exports = Option;
