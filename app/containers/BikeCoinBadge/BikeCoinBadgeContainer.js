// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { handleFetchingUserProposals } from 'modules/userProposals';

import { bikeCoinContainer, units, icon } from './styles.css';

type Props = {
    uid: string;
    isFetching: boolean;
    units: number;

    handleFetchingUserProposals: Function;
}

class BikeCoinBadgeContainer extends React.Component {
    componentDidMount () {
        this.props.handleFetchingUserProposals(this.props.uid);
    }
    render () {
        return (
            <div className={bikeCoinContainer}>
                <div className={icon}/>
                <div className={units}>{ this.props.isFetching ? '--' : this.props.units }</div>
            </div>
        );
    }
}

function mapStateToProps (state, props) {
    return {
        uid: state.users.get('authedId'),
        isFetching: state.userProposals.get('isFetching'),
        units: state.userProposals.get('units'),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingUserProposals,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BikeCoinBadgeContainer);

