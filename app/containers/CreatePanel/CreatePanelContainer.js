// @flow
import React from 'react';
import { bindActionCreators, type Dispatch } from 'redux';
import { connect } from 'react-redux';
import { handleFetchingPatterns } from 'modules/patterns';
import { handleFetchSingleRoad } from 'modules/roads';
import { handleFetchingUserProposals,
    setPatternId,
    setDomain,
    setSliderDisabled,
    setSubmitDisabled,
    setRequiredPoints,
} from 'modules/userProposals';
import { handleAddProposal } from 'modules/proposals';
import { getTotalLength } from 'helpers/utils';
import { CreatePanel } from 'components';

import { Map } from 'immutable';

type Props = {
    uid: string;
    roadId: string;
    road: Map<any, any>;
    domain: Map<any, any>;
    patterns: Map<any, any>;
    patternId: string;
    submitDisabled: boolean;
    requiredPoints: number;

    handleAddProposal: Function;
    handleFetchingPatterns: Function;
    handleFetchSingleRoad: Function;
    handleFetchingUserProposals: Function;
    setPatternId: Function;
    setDomain: Function;
    setSliderDisabled: Function;
    setSubmitDisabled: Function;
    setRequiredPoints: Function;
    router: Object;
}

class CreatePanelContainer extends React.Component<void, Props, void> {
    constructor (props: Props) {
        super(props);

        this.optionsInfo = [];

        this.handleSliderUpdate = this.handleSliderUpdate.bind(this);
        this.handleSelectPattern = this.handleSelectPattern.bind(this);
        this.handleClickSubmit = this.handleClickSubmit.bind(this);
        this.backgroundImage = '';
    }

    optionsInfo: Array<Array<string>>;
    requiredUnits: number;
    backgroundImage: string;

    router: Object;
    handleSliderUpdate: Function;
    handleSelectPattern: Function;
    handleClickSubmit: Function;

    componentDidMount () {
        this.props.handleFetchingPatterns();
        this.props.handleFetchSingleRoad(this.props.roadId);
        this.props.handleFetchingUserProposals(this.props.uid);
    }

    componentWillUpdate (nextProps:Props) {

        if (nextProps.isFetching) {
            this.optionsInfo = [];
        } else {
            this.optionsInfo = Object.keys(nextProps.patterns.toJS())
                .filter((key) => key !== 'lastUpdated' && key !== 'error' && key !== 'isFetching')
                .map((key) => ([key, nextProps.patterns.toJS()[key].title]));
        }
    }

    getCoinsRequired (perUnit: number, domain: {start: number, end: number}) {
        // get road length
        if (!this.props.road) {
            this.props.setSubmitDisabled(true);
            return 0;
        } else {
            const roadLength: number = getTotalLength(this.props.road.get('geometry').toJS());
            const p = domain.end - domain.start;
            this.props.setSubmitDisabled(false);
            return Math.floor(roadLength * p * perUnit);
        }
    }

    handleSliderUpdate (domain: {start: number, end: number}) {
        const pattern = this.props.patterns.get(this.props.patternId);
        const perUnits = pattern.get('units');
        this.props.setRequiredPoints(this.getCoinsRequired(perUnits, domain));
    }

    handleSelectPattern (obj) {
        const patternId = obj.target.value;
        if (patternId === '') {
            this.props.setSliderDisabled(true);
            this.props.setSubmitDisabled(true);
        } else {
            this.props.setPatternId(patternId);
            // this.props.setDomain({start: 0, end: 1});
            this.props.setSubmitDisabled(false);
            const pattern = ((this.props.patterns.get(patternId): any): Map<any, any>);
            this.backgroundImage = pattern.get('image');
            const perWhat: ?string = pattern.get('per');
            const perUnits: number = ((pattern.get('units'): any): number);
            if (perWhat && perWhat === 'road') {
                this.props.setRequiredPoints(perUnits);
                this.props.setSliderDisabled(true);
            } else {
                this.props.setSliderDisabled(false);
                this.props.setRequiredPoints(this.getCoinsRequired(perUnits, this.props.domain.toJS()));
            }
        }
    }

    handleClickSubmit () {
        const {uid, roadId, patternId, requiredPoints} = this.props;
        const domain = this.props.domain.toJS();
        const proposal = {
            uid,
            roadId,
            patternId,
            domain,
            maxUnits: requiredPoints,
        };
        this.props.handleAddProposal(proposal);
        this.props.router.replace(`/proposals#road-${roadId}`);
    }

    render () {
        return (
            <CreatePanel
                requiredUnits={this.props.requiredPoints}
                backgroundImage={this.backgroundImage}
                submitDisabled={this.props.submitDisabled}
                optionsInfo={this.optionsInfo}
                onSelectPattern={this.handleSelectPattern}
                onChangeSlider={this.handleSliderUpdate}
                onClickSubmit={this.handleClickSubmit}/>
        );
    }
}

function mapStateToProps ({ users, roads, patterns, userProposals }, props) {
    const roadId = props.roadId;
    return {
        uid: users.get('authedId'),
        isFetching: patterns.get('isFetching') || roads.get('isFetching') || users.get('isFetching'),
        submitDisabled: userProposals.getIn(['create', 'submitDisabled']),
        domain: userProposals.getIn(['create', 'domain']),
        roadId,
        road: roads.get(roadId),
        patternId: userProposals.getIn(['create', 'patternId']),
        patterns,
        requiredPoints: userProposals.getIn(['create', 'requiredPoints']),
        router: props.router,
    };
}

function mapDispatchToProps (dispatch: Dispatch<*>) {
    return bindActionCreators({
        handleFetchingPatterns,
        handleFetchSingleRoad,
        handleFetchingUserProposals,
        handleAddProposal,
        setDomain,
        setPatternId,
        setSliderDisabled,
        setSubmitDisabled,
        setRequiredPoints,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePanelContainer);
