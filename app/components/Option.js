import React from 'react';

let PropTypes = React.PropTypes;


function Option(props) {
    return (
        <button type='button' onClick={this.props.onClick}>{this.props.text}</button>
    );
}

Option

var Option = React.createClass({
    PropTypes: {
        text: PropTypes.string,
        id: PropTypes.number,
        onClick: PropTypes.func.isRequired,
    },
    render: function () {
        return (
            //<div className="option">{this.props.text}</div>
            <button type='button' onClick={this.props.onClick}>{this.props.text}</button>
        )
    }
});

module.exports = Option;
