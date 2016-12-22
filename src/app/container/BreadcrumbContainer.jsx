/**
 * bikebump
 * BreadcrumbContainer
 * 12/22/16
 * by yasushisakai
 */

import React, {Component} from 'react';
import GeoLocationHelper from '../../helpers/GeoLocationHelper';
import axios from 'axios';
import Config from '../settings/config'

const config = new Config(window);

/**
 * BreadcrumbContainer class
 */
export default class BreadcrumbContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            breadcrumbs: []
        };

        this.update = this.update.bind(this);

        this.buttonStyle = {
            padding: "10px",
            marginRight : "5px",
            backgroundColor: "#202020",
            color: "#F0F0F0",
            border: "none"
        }
    }

    // getInitialState(){}
    componentDidMount() {

        this.interval = setInterval(this.update, 10000)

    }

    // componentDidUpdate(){}
    componentWillUnmount() {
        this.update();
        clearInterval(this.interval)

    }

    update() {
        // get geolocation

        GeoLocationHelper.getGeoLocation()
            .then(location=> {

                const crumb = {};
                crumb.timestamp = Date.now();
                crumb.lat = location.latitude;
                crumb.lng = location.longitude;

                this.state.breadcrumbs.push(crumb);

                this.setState({
                    breadcrumbs: this.state.breadcrumbs
                });
            })

    }

    listCrumbs() {

        return this.state.breadcrumbs.map((crumb, index)=> {
            return <p key={index}>{crumb.timestamp},{crumb.lat},{crumb.lng}</p>
        })

    }

    refreshCrumb() {

        // send the crumbs to the server
        axios.post(config.api_root + 'trips/upload', {breadcrumbs: this.state.breadcrumbs})
            .then(response => {

                    if (response.data.result == 'error') {
                        console.warn(response.data.message);

                        // hold on to that bread crumbs!!

                    } else {
                        console.log(response.data.result);

                        // flush the array
                        this.setState({
                            breadcrumbs: []
                        })

                    }

                }
            );
    }

    clearCrumbs() {
        this.setState({
            breadcrumbs: []
        })
    }

    render() {
        return (
            <div>
                <h1>{'bread crumbs'}</h1>
                <div>
                    <button style={this.buttonStyle} onClick={this.clearCrumbs.bind(this)}> clear</button>
                    <button style={this.buttonStyle} onClick={this.refreshCrumb.bind(this)}> submit</button>
                </div>
                {this.listCrumbs()}
            </div>
        );
    }
}

BreadcrumbContainer.propTypes = {};

BreadcrumbContainer.defaultProps = {};