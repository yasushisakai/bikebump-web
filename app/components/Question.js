// created at 2016.10.02
// by yasushisakai

import React, {PropTypes} from 'react'

//
// Question Stateless Function
//
export default function Question(props) {
    return (
        <div className="question">
        <span className="question-text"> {props.text} </span>
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