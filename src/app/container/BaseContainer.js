// bikebump
// BaseContainer
// 10/23/16
// by yasushisakai

import React, {Component} from 'react';
import Base from '../components/Base';

//
// BaseContainer class
//
export default class BaseContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    // getInitialState(){}
    componentDidMount() {

        let browser = navigator.userAgent.toLowerCase().indexOf();

        //console.log(browser);

    }

    // componentDidUpdate(){}
    // componentWillUnmount(){}

    render() {
        return (
            <Base>
                {this.props.children}
            </Base>
        );
    }
}