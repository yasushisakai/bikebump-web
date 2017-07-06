import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { formatGoogleStreetViewURL } from 'helpers/utils';

import * as dingActionCreators from 'modules/dings';
import type { Ding } from 'types';

 type Props = {
    isFetching: boolean;
    dingId: ?string;
    ding: Ding;
    handleFetchingDing: Function;
  }

class StreetViewContainer extends React.Component<void, Props, void> {
    constructor (props) {
        super(props);
        this.googleStreetViewTag = this.googleStreetViewTag.bind(this);
    }
    googleStreetViewTag () {
        if (this.props.dingId !== '' && this.props.ding !== new Map()) {
            let url;
            if (this.props.ding.closestRoadPoint) {
                url = formatGoogleStreetViewURL(this.props.ding.closestRoadPoint);
            } else {
                url = formatGoogleStreetViewURL(this.props.ding.coordinates);
            }
            return {height: '100%', background: `url(${url}) center center no-repeat`, backgroundSize: 'cover'};
        } else {
            return {};
        }
    }

    render () {
        return <div style={this.googleStreetViewTag()} />;
    }
}

function mapStateToProps (state, props) {
    const rawDing: Map<any, any> = (state.ding.get(props.dingId):any) || new Map();
    return {
        isFetching: state.dings.get('isFetching') || state.dingFeed.get('isFetching'),
        dingId: props.dingId,
        ding: rawDing.toJS(),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        ...dingActionCreators,
    }, dispatch);
}

export default connect(mapStateToProps,
    mapDispatchToProps)(StreetViewContainer);
