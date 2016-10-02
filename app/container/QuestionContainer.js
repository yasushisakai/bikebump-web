// created at 2016.10.02
// by yasushisakai

import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import config from '../config';
import GeoLocationHelper from '../utilities/GeoLocationHelper'

import Question from '../components/Question';
import Option from '../components/Option'

//
// QuestionContainer class
//
export default class QuestionContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {

            userId: '0',
            lat: null,
            lng: null,

            questionId: '0',
            fenceId: null,
            text: 'loading question...',
            options: [],
            radius: 10, //meters

            fences: [],
            includingFences: []

        };

        this.isLoading = true;
        this.interval;
        this.updateCoordinatesAndFences = this.updateCoordinatesAndFences.bind(this);

    }

    static getQuestionListFromAPI(id) {

        if (typeof(id) == 'undefined') {
            console.error('QuestionContainer.getQuestionFromAPI: question id undefined');
        }

        let path = config.api_root + 'questions/' + id;

        return axios.get(path)
            .then((response)=> {
                return response.data
            })
            .catch((err)=> {
                console.error(err);
            });
    }

    static getFenceListFromAPI() {

        let path = config.api_root + 'fences/';

        return axios.get(path)
            .then((response)=> {
                return response.data
            })
            .catch((err)=> {
                console.error(err);
                return []
            });
    }

    updateCoordinatesAndFences() {
        // TODO: breakdown this funtion into smaller pieces?

        console.log('tick');

        var promises = [];

        // get the list of fences
        promises.push(QuestionContainer.getFenceListFromAPI());

        // get the current coordinates
        promises.push(GeoLocationHelper.getGeoLocation());

        Promise.all(promises).then(objs => {


            let includingFences = GeoLocationHelper.includingFences(
                objs[0],
                objs[1].latitude,
                objs[1].longitude
            );

            let fenceId;
            if (includingFences.length == 0) {
                fenceId = null;
                this.setQuestion('0');
            } else {
                // select the fence id;
                fenceId = includingFences[0].id;
                // setQuestionId
                this.setQuestion('0'); //same
            }

            this.setState({
                fenceId: fenceId,
                fences: objs[0],
                lat: objs[1].latitude,
                lng: objs[1].longitude,
                includingFences: includingFences
            });

        });
    }

    setQuestion(id) {
        if (typeof(id) == 'undefined') {
            id = this.state.questionId;
        }

        QuestionContainer.getQuestionListFromAPI(id)
            .then((data)=> {
                this.setState({
                    questionId: id,
                    text: data.text,
                    options: data.options
                })
            })
            .catch(()=> {
                console.log('error in setQuestion');
            });
    }


    handleButtonClick(index) {
        console.log(this.state);
        console.log('hit button index: ' + index);

        if (this.state.fenceId == null) {
            //fences/add?u=userid&lat=49&lng=-71&r=10&a=2
            let new_fence_url = config.api_root + 'fences/add?' +
                'u=' + this.state.userId +
                '&lat=' + this.state.lat +
                '&lng=' + this.state.lng +
                '&r=' + this.state.radius +
                '&a=' + index;
            axios.get(new_fence_url).then((response)=> {
                this.setState({
                    fences: this.state.fences.push(response.data)
                })
            })

        } else {
            //fences/:id/append?u=userid&q=0&a=2
            let new_fence_url = config.api_root + 'fences/'+
                this.state.fenceId + '/append?' +
                'u=' + this.state.userId +
                '&q=' + this.state.questionId +
                '&a=' + index;

            axios.get(new_fence_url).then((response)=> {
                this.setState({
                    fences: this.state.fences.push(response.data)
                });
            });
        }

    }

    componentDidMount() {
        this.setQuestion();
        this.updateCoordinatesAndFences();
        this.interval = setInterval(this.updateCoordinatesAndFences, 10000); // millisec
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderOptions() {

        let options = [];

        for (let i = 0; i < this.state.options.length; i++) {
            options.push(
                <Option
                    key={i}
                    text={this.state.options[i]}
                    onClick={this.handleButtonClick.bind(this, i)}
                />
            );
        }

        return options

    }

    render() {

        // check if it's still loading stuff
        this.isLoading = (
            (this.state.lat == null || this.state.lng == null) ||
            this.state.text.startsWith('loading') ||
            this.state.options === 0
        );

        return (
            <div className="question-container">
                { this.isLoading
                    ? <Question text={this.state.text}/>
                    :
                    <Question text={this.state.text}>
                        <div className="buttons">
                            {this.renderOptions()}
                        </div>
                        <div> latitude:{this.state.lat}, longitude:{this.state.lng} </div>
                    </Question>
                }
            </div>
        )
    }
}

QuestionContainer
    .propTypes = {};
QuestionContainer
    .defaultProps = {};