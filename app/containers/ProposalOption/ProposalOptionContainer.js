// @flow
import { handleFetchingUserProposals } from 'modules/userProposals';
import { handleFetchingProposals, handleBikecoinTransaction } from 'modules/proposals';

import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { proposalOption, optionText, optionValue } from './styles.css';
import { black } from 'config/constants';
type Props = {
    uid: string;
    isFetching: boolean;
    value: number;
    text: string;
    color: string;
    backgroundColor: string;
    myUnits: number;
    currentUnits: number;
    maxUnits: number;
    proposalId: string;
    currentSelection: number;

    handleFetchingProposals: Function;
    handleFetchingUserProposals: Function;
    handleBikecoinTransaction: Function;
}

class ProposalOptionContainer extends React.Component<void, Props, void> {
    constructor (props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount () {
        this.props.handleFetchingUserProposals(this.props.uid);
        this.props.handleFetchingProposals();
    }

    onClick: Function;
    onClick () {
        this.props.handleBikecoinTransaction(this.props.uid, this.props.proposalId, this.props.value);
    }

    render () {
        let style = (this.props.myUnits + this.props.currentSelection) < this.props.value 
            ? {
                color: '#222',
                backgroundColor: black,
                pointerEvents: 'none',
            }
            : {
                color: this.props.color,
                backgroundColor: this.props.backgroundColor,
                cursor: 'pointer',
            };
        
        if (this.props.currentUnits - this.props.value === 0) {
            style = {
                ...style,
                border: '1px solid rgba(240, 240, 240, 1.0)',
                //boxShadow: 'inset 1px 1px 1px 0px rgba(0,0,0,0.3)',
            };
        }

        return (<div className={`${proposalOption} pt-button`} style={style} onClick={this.onClick}>
            <div className={optionText}>{this.props.text}</div>
            <div className={optionValue}>{this.props.value}</div>
        </div>);
    }
}

function mapStateToProps (state, props) {
    const proposalId = props.id;
    return {
        uid: state.users.get('authedId'),
        text: props.text,
        color: props.color,
        backgroundColor: props.backgroundColor,
        proposalId,
        isFetching: state.userProposals.get('isFetching'),
        currentSelection: state.userProposals.getIn(['votes', proposalId]) | 0,
        value: props.value,
        myUnits: state.userProposals.get('units'),
        currentUnits: state.proposals.getIn([proposalId, 'currentUnits']),
        maxUnits: state.proposals.getIn([proposalId, 'maxUnits']),
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingUserProposals,
        handleFetchingProposals,
        handleBikecoinTransaction,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalOptionContainer);

