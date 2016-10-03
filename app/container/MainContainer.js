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
            isLoggedIn : false,
            isLandScape : window.innerHeight < window.innerWidth
        };

        // set a event listener
        window.addEventListener("resize",()=>{
           if(this.state.isLandScape != window.innerHeight < window.innerWidth){
               this.setState({
                   isLandScape: !this.state.isLandScape
               })
           }
        });
    }

    render(){
        return(
            <Main isLoggedIn={this.state.isLoggedIn} >

                <QuestionContainer isLandscape = {this.state.isLandScape}/>
            </Main>
        );
    }
}