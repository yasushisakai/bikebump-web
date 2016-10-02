import React, {PropTypes} from 'react';
import QuestionContainer from '../container/QuestionContainer';

export function Main(props) {

    let loginText = props.isLoggedIn ? 'logged in' : 'anon';

    return (
        <div className="app">
            {loginText}
            <h1>Main</h1>
            <QuestionContainer/>
        </div>
    )
}

Main.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired
};

Main.defaultProps = {
    isLoggedIn: false
};
