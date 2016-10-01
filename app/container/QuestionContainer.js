var React = require('react');
var PropTypes = React.PropTypes;
var axios = require('axios');

var config = require('../config');
var GeoLocationHelpers = require('../utilities/GeoLocationHelpers');
var Question = require('../components/Question');
var Option = require('../components/Option');

//
// design question : where do we implement the logic to select which question??
//

var QuestionContainer = React.createClass({
    PropTypes: {
        userid: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired
    },
    getInitialState: function () {
        return {
            text: 'loading question...',
            options: [],
            isInFence: false,
            latitude: null,
            longitude: null,
            radius: 5 // in meters
        }
    },
    getDefaultProps: function () {
        return {
            userid: '0',
            id: '0' // gets the first question in default
        };
    },
    getQuestionFromEndpoint: function () {
        var questionURL = config.api_root + "questions/" + this.props.id;
        return axios.get(questionURL);
    },
    setQuestion: function () {
        return (this.getQuestionFromEndpoint()
            .then(function (response) {
                console.log("setQuestion");
                console.log(response.data.options);
                this.setState({
                    text: response.data.text,
                    options: response.data.options
                }); // does did mount trigger right here?
                return response.data.options
            }.bind(this))
            .catch(function (err) {
                console.error(err)
            }));
    },
    addFence: function (optionIndex) {
        // fences/add?u=userid&lat=49&lng=-71&r=10&a=2

        var addQuestionURL = config.api_root
            + 'fences/add?u=' + this.props.userid
            + '&lat=' + this.state.latitude
            + '&lng=' + this.state.longitude
            + '&r=' + this.state.radius
            + '&a=' + optionIndex;
        return axios.get(addQuestionURL);
    },
    handleOptionClick: function (id) {
        this.addFence(id)
            .then((response)=> {
                console.log(response);
            })
            .catch((err)=> {
                console.log(err);
            });
    },
    setOptions: function () {
        var options = this.state.options.map((object, index)=> {
            return <Option onClick={this.handleOptionClick.bind(this,index)} key={index} text={object}/>

        });
        return options;
    },
    setLatLng: function (position) {
        this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },
    componentDidMount: function () {
        this.setQuestion();
        GeoLocationHelpers.getLatLng(this);
    },
    render: function () {
        var options = this.setOptions();
        return (
            <div className="question">
                <Question text={this.state.text}/>
                {options}
                {this.state.latitude === null
                    ? <div className="questionNoLocation"></div>
                    : <div className="questionLocation"> latitude={this.state.latitude},
                    longitude={this.state.longitude} </div>
                }
            </div>
        )
    }
});

module.exports = QuestionContainer;
