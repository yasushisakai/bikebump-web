// created at 2016.10.02
// by yasushisakai

import React, {Component} from 'react';
import Main from '../components/Main';
import QuestionContainer from './QuestionContainer';

//
// MainContainer class
//
export default class MainContainer extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false
        }
    }

    render(){
        return(
            <Main isLoggedIn={this.state.isLoggedIn} >
                <QuestionContainer />
            </Main>
        );
    }
}