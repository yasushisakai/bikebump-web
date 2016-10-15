// created at 2016.10.02
// by yasushisakai

import React, {Component, PropTypes} from 'react';
import axios from 'axios';
import Config from '../config';
import GeoLocationHelper from '../utilities/GeoLocationHelper'
import Helpers from '../utilities/Helpers';

import Question from '../components/Question';
import Option from '../components/Option'
import InfoBox from '../components/InfoBox';

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

    updateCoordinatesAndFences() {
        // TODO: breakdown this function into smaller pieces?

        var promises = [];

        // get the list of fences
        promises.push(Helpers.getFenceListFromAPI());

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
                console.log(fenceId);
                // setQuestionId
                // todo: logic to change question
                this.setQuestion('0'); //same question

            }

            this.setState({
                fenceId: fenceId,
                fences: objs[0],
                lat: objs[1].latitude,
                lng: objs[1].longitude,
                includingFences: includingFences
            });


            console.log(fenceId);

            let qText = document.getElementById('infoBox');
            Helpers.show(qText);
            Helpers.fade(qText);

            if (fenceId != null) {
                let dominantAnswer = this.getDominantAnswer();
                this.changeBackgroundColor(dominantAnswer);
            } else {
                // setColor color to white
                let root = document.getElementById('root');
                root.style.backgroundColor = 'white';
            }
        });
    }

    setQuestion(id) {
        if (typeof(id) == 'undefined') {
            id = this.state.questionId;
        }

        Helpers.getQuestionListFromAPI(id)
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

    getDominantAnswer() {

        let answerCount = [0, 0, 0, 0];

        for (let i = 0; i < this.state.includingFences.length; i++) {
            for (let j = 0; j < this.state.includingFences[i].answer.length; j++) {
                let response = this.state.includingFences[i].answer[j];
                if (response.question == this.state.questionId) {
                    answerCount[response.answer]++;
                }
            }
        }

        return answerCount.indexOf(Math.max.apply(null, answerCount));

    }

    // todo: may not need to ask for the question
    changeBackgroundColor(answerId) {
        Helpers.getQuestionListFromAPI(this.state.questionId)
            .then((question)=> {

                let newColor = question.options[answerId][1];
                // change background color to...

                let root = document.getElementById('root');
                root.style.backgroundColor = newColor;

            });
    }

    getStatus(){

        if(this.state.fenceId == null){
            return 'no fence found near'
        }else{
            let answer = this.state.options[this.getDominantAnswer()][0];
            return 'most people say this place is '+answer+ '. Fence Id:'+this.state.fenceId;
        }

    }

    handleButtonClick(index) {

        if (this.state.fenceId == null) {
            //fences/add?u=userid&lat=49&lng=-71&r=10&a=2
            let new_fence_url = Config.api_root() + 'fences/add?' +
                'u=' + this.state.userId +
                '&lat=' + this.state.lat +
                '&lng=' + this.state.lng +
                '&r=' + this.state.radius +
                '&a=' + index;
            axios.get(new_fence_url).then((response)=> {
                this.setState({
                    fences: this.state.fences.push(response.data)
                });

                console.log("added fence");
            }).then(this.updateCoordinatesAndFences);


        } else {
            //fences/:id/append?u=userid&q=0&a=2
            let new_fence_url = Config.api_root() + 'fences/' +
                this.state.fenceId + '/append?' +
                'u=' + this.state.userId +
                '&q=' + this.state.questionId +
                '&a=' + index;

            axios.get(new_fence_url).then((response)=> {
                this.setState({
                    fences: this.state.fences.push(response.data)
                });

                console.log("append fence");

            }).then(this.updateCoordinatesAndFences);
        }

    }

    componentDidMount() {
        this.setQuestion();
        this.updateCoordinatesAndFences();
        this.interval = setInterval(this.updateCoordinatesAndFences, 7000); // millisec
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
                    options={this.state.options[i]}
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

        let isInFence = this.state.fenceId != null;

        return (
            <div className="question-container grid__col grid__col--2-of-2">
                { this.isLoading
                    ? <Question text={this.state.text}/>
                    :
                    <Question text={this.state.text}>
                        <div className="buttons-group">
                            {this.renderOptions()}
                            <InfoBox lat={this.state.lat} lng={this.state.lng} status={this.getStatus()}/>
                        </div>
                    </Question>
                }
            </div>
        )
    }
}

QuestionContainer.propTypes = {
    isLandscape: PropTypes.bool.isRequired
};
QuestionContainer
    .defaultProps = {};