/**
 * bikebump
 * Question.jsx
 * by yasushisakai
 * 10/13/16
 */

import React, {PropTypes} from 'react'

/**
 * Question Stateless Function
 */
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