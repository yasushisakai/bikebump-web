/**
 * bikebump
 * QuestionContainer.jsx
 * by yasushisakai
 * 10/13/16
 */

import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import Config from '../settings/config';
import GeoLocationHelper from '../../helpers/GeoLocationHelper'
import Point from '../../geometry/Point';

import Loading from '../components/Loading';
import Question from '../components/Question';
import Option from '../components/Option'
import InfoBox from '../components/InfoBox';


let config = new Config(window);

/**
 * QuestionContainer class
 */
export default class QuestionContainer extends Component {

    constructor(props) {
        super(props);

        this.interval;

        this.userId = '0';

        this.question = {};
        this.question.text = '';
        this.question.options = [];
        this.question.radius = 10;

        this.fences = [];
        // this should be just one... (closest and included)
        this.includingFence = null;

        this.currentStatus = '';

        // changing the state by setState(state) will run render function
        this.state = {
            isLoading: true,
            lat: null,
            lng: null,
            questionId: '-1',
            fenceHash: ''
        };


        this.update = this.update.bind(this);

    }


    // this sets the closest including fence,
    // receives a object that has lat, lng properties
    // returns null if there is not including fence
    updateIncludingFence(state) {
        let here = new Point(state.lat, state.lng);
        let minDistance = 100000000000;

        this.includingFence = null;

        if (this.fences != null) {
            this.fences.map((fence)=> {

                let center = new Point(fence.coordinates.lat, fence.coordinates.lng);

                let distance = here.distanceToInMeters(center);

                if (distance < parseFloat(fence.radius)) {
                    if (distance < minDistance) {
                        minDistance = distance;
                        this.includingFence = fence;
                    }
                }
            });
        }
    }

    // gets the most frequent answer value
    dominantAnswer(questionId) {
        if (typeof questionId == 'undefined') {
            questionId = this.state.questionId
        }


        let indexCount = [0, 0, 0, 0];

        if (this.includingFence == null) return -1;

        this.includingFence.answers.map((answer)=> {
            if (answer.question == questionId) {9
                indexCount[answer.value]++;
            }
        });

        let dominant = indexCount.indexOf(Math.max(...indexCount));

        return dominant;

    }

    updateFences() {
        return axios.get(config.api_root+'fences/check?' + this.state.fenceHash)
            .then(response=> {

                let result = response.data;

                if (result) {
                    return Promise.resolve(null);
                } else {
                    return axios.get(config.api_root+'fences')
                        .then((response)=>{
                            return Promise.resolve(response.data);
                        })
                }
            })

    }

    updateQuestion(_id) {
        let id = typeof _id == 'undefined' ? '0' : _id;

        if (id != this.state.questionId) {

            return axios.get(config.api_root + 'questions/' + id)
                .then((response)=> {

                    let data = response.data;

                    this.question.text = data.text;
                    this.question.options = data.options;

                    return Promise.resolve({changed: true, id: id});
                })
                .catch((err)=> {console.error(err);})
        } else {
            return Promise.resolve({changed: false, id: id});
        }
    }

    update() {
        let promises = [];
        promises.push(this.updateFences());
        promises.push(GeoLocationHelper.getGeoLocation());

        //
        // TODO: logic to change the question
        //
        promises.push(this.updateQuestion());

        Promise.all(promises)
            .then(objects=> {

                let state = {};

                if (objects[0] != null) {
                    this.fences = objects[0].fences;
                    state.fenceHash = objects[0].hash;
                }

                state.lat = objects[1].latitude;
                state.lng = objects[1].longitude;

                this.updateIncludingFence(state);

                if (objects[2].changed) {

                    let id = objects[2].id;
                    state.questionId = id;

                }

                state.isLoading = false;

                this.setState(state);

                console.log('update');

                return Promise.resolve(true);

            });


    }


    changeBackgroundColor(dominantAnswer) {
        let newColor = dominantAnswer == -1 ? '#FFFFFF' : this.question.options[dominantAnswer][1];
        let root = document.getElementById('root');
        root.style.backgroundColor = newColor;

    }

    setStatus(dominantAnswer) {
        if (!(this.includingFence == null || dominantAnswer == -1)) {

            this.currentStatus =
                'most people say this place is ' +
                this.question.options[dominantAnswer][0] + '.';
        } else {
            this.currentStatus = '';
        }
    }
    //Look Here
    handleButtonClick(index) {
        //
        // creating a new fence
        //
        if (this.includingFence == null) {
            //
            //fences/add?u=userid&lat=49&lng=-71&r=10&a=2
            //

            let new_fence_url = config.api_root + 'fences/add?' +
                'u=' + this.userId +
                '&lat=' + this.state.lat +
                '&lng=' + this.state.lng +
                '&r=' + this.question.radius +
                '&a=' + index;

            axios.get(new_fence_url).then((response)=> {
                console.log(response.data.fence);
                this.fences.push(response.data.fence);
                this.includingFence = response.data.fence;

                this.setState({
                    fenceHash: response.data.hash
                });

            });


            //
            // adding a new response to a existing fence
            //
        } else {
            //
            //fences/:id/append?u=userid&q=0&a=2
            //

            let new_fence_url = config.api_root + 'fences/' +
                this.includingFence.id + '/append?' +
                'u=' + this.userId +
                '&q=' + this.state.questionId +
                '&a=' + index;

            for (let i = 0, l = this.fences.length; i < l; ++i) {

                if (this.fences[i].id == this.includingFence.id) {
                    let newAnswer = {
                        userid: this.userId,
                        question: this.state.questionId,
                        value: index,
                        timestamp: Date.now()
                    };
                    this.fences[i].answers.push(newAnswer);

                    break;
                }
            }

            axios.get(new_fence_url).then((response)=> {

                console.log(new_fence_url);


                this.setState({
                    fenceHash: response.data.hash
                });

            });
        }

    }

    componentDidMount() {
        this.update();
        this.interval = setInterval(this.update, 7000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    renderOptions() {

        return this.question.options.map((option, index)=> {

            return (
                <Option
                    key={index}
                    options={this.question.options[index]}
                    onClick={this.handleButtonClick.bind(this, index)}
                />
            );

        });

    }

    render() {

        let dominant = this.dominantAnswer(this.state.questionId);
        this.changeBackgroundColor(dominant);
        this.setStatus(dominant);

        if (this.state.isLoading) {
            return (
                <Loading text="location data"/>
            )
        } else {
            return (
                <div className="question-container">
                    <Question text={this.question.text}>
                        <div className="buttons-group">
                            {this.renderOptions()}
                            <InfoBox lat={this.state.lat} lng={this.state.lng} status={this.currentStatus}/>
                        </div>
                    </Question>
                </div>
            )
        }
    }
}

QuestionContainer.propTypes = {
    isLandscape: PropTypes.bool.isRequired
};
QuestionContainer
    .defaultProps = {};