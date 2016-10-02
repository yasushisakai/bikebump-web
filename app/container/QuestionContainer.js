import React  from 'react';
import axios from 'axios';
import config from '../config';
import GeoLocationHelper from '../utilities/GeoLocationHelpers';
import Question from '../components/Question';
import Option from '../components/Option'


export class QuestionContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            text: 'loading question...',
            options: [],
            fences: [],
            lat: null,
            lng: null,
            radius: 5,
            isInFence: false,
            hasLocation: false
        }
    }

    render(){
        <Question text={this.state.text}/>
    }
}

QuestionContainer.propTypes = {
    userId: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired
};

QuestionContainer.defaultProps = {
    userId: '0',
    id: '0'
};

