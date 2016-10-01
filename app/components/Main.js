import React, {PropTypes} from 'react';
import QuestionContainer from '../container/QuestionContainer';

function Main(props) {

    let loginText = props.isLoggedIn ? 'logged in' : 'anon';

    return (
        <div className="app">
            {loginText}
            <h1>Main</h1>
            <QuestionContainer/>
        </div>
    )
}

Main.PropTypes = {
    isLoggedIn: PropTypes.bool.isRequired
};


module.exports = Main;
