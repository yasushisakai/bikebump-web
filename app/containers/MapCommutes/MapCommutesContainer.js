// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { MapCommutes } from 'components';
import { handleFetchingCommutes } from 'modules/commutes';
import { filterStateVariables } from 'helpers/utils';
import { map, Map, tileLayer, polyline, Polyline } from 'leaflet';
import { darkTile, attribution } from 'config/constants';

type Props = {
    isFetching: true,
    commutes: any,

    handleFetchingCommutes: Function;
}

class MapCommutesContainer extends React.Component<void, Props, void> {
    map: Map;

    componentDidMount () {
        this.props.handleFetchingCommutes();

        const location = [42.355596, -71.101363];
        this.map = map('mapCommutes').setView(location, 18);
        tileLayer(darkTile, {attribution}).addTo(this.map);
    }

    commuteToCoordinates (commute) {
        return commute.keySeq().toArray()
            .map()
    }

    plotCommutes (props: Props) {
        props.commutes.keySeq().toArray()
            .filter(key => filterStateVariables(key))
            .map(key => {
                const commute = props.commutes.get(key);
                console.log(commute.toJS());
                const commutePolyline: Polyline = polyline(commute.getIn(['geometery', 'coordinates']).toJS());
                polyline.addTo(this.map);
            });
    }

    componentWillUpdate (nextProps: Props) {
        if (!nextProps.isFetching) {
            this.plotCommutes(nextProps);
        }
    }

    render () {
        return (
            <MapCommutes/>
        );
    }
}

function mapStateToProps ({commutes}, props) {
    return {
        isFetching: commutes.get('isFetching'),
        commutes: commutes,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingCommutes,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MapCommutesContainer);
