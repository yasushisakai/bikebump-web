import React from 'react';
import Main from '../components/Main';


class MainContainer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false
        };
    }

    render() {
        return (
            <Main isLoggedIn={this.state.isLoggedIn}/>
        )

    }
}

module.exports = MainContainer;