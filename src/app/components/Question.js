// created at 2016.10.02
// by yasushisakai

import React, {PropTypes} from 'react'

//
// Question Stateless Function
//
export default function Question(props) {
    return (
        <div className="question">
        <div id="questionText" className="question-text">
            <div className="vertical-center">{props.text}</div>
        </div>
            {props.children}
        </div>
    );
};

Question.propTypes = {
    text : PropTypes.string.isRequired
};
Question.defaultProps = {
    text : "question text"
};