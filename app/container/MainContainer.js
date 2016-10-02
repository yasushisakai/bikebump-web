import React, { Component } from 'react';
import Main from '../components/Main';


export class MainContainer extends Component {

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