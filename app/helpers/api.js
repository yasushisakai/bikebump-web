// @flow
import axios from 'axios';
import { apiRoot, ref } from 'config/constants';
import { userDingStatus } from 'modules/userDings';

export function fetchUser (uid: string): Promise<any> {
    return ref.child(`users/${uid}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function createDing (lat: number, lng: number, uid: string, timestamp: number, value: number): Promise<any> {
    return axios.post(`${apiRoot}dings/add`,
        {
            lat,
            lng,
            uid,
            timestamp,
            value,
        }
    )
        .then(result => result.data);
}

export function createUserDing (uid: string, dingId: string, status: userDingStatus = userDingStatus.DINGED, commuteId: string, timestamp: number) {
    return ref.child(`userDings/${uid}/${dingId}`).set({status, commuteId, timestamp})
        .then(() => ({uid, dingId, status}));
}

export function fetchUserDings (uid: string) {
    return ref.child(`userDings/${uid}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function listenToDings (callback: Function, errorCallback: Function) {
    ref.child(`dings/`).on('value',
        (snapshot) => {
            const dings = snapshot.val() || {};
            callback(dings);
            return dings;
        },
        errorCallback);
}

export function fetchDings () {
    return ref.child(`dings/`).once('value')
        .then(snapshot => (snapshot.val() || {}));
}

export function fetchDing (dingId) {
    return ref.child(`dings/${dingId}`).once('value')
        .then(snapshot => (snapshot.val() || {}));
}

export function fetchRoad (roadId) {
    return ref.child(`roads/${roadId}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function fetchRoads () {
    return ref.child(`roads`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function fetchCommutes () {
    return ref.child('commutes').once('value')
        .then((snapshot) => (snapshot.val() || {}));
}
export function saveCommute (uid: string, breadcrumbs: any) {
    const commuteId = ref.child('commutes').push().key;
    const commute = {...breadcrumbs, commuteId, uid};
    return ref.child(`commutes/${commuteId}`).set(commute)
        .then(() => commute);
}

export function createCommute (uid: string) {
    // initiates a commute
    const commuteId = ref.child('commutes').push().key;
    return ref.child(`commutes/${commuteId}`).set({uid})
        .then(() => commuteId);
}

export function appendBreadcrumb (commuteId: string, coordinate: LatLng, timestamp: number = Date.now()) {
    ref.child(`commutes/${commuteId}/${timestamp}`).set(coordinate)
        .then(() => (null));
}

export function deleteCommute (commuteId: string) {
    ref.child(`commutes/${commuteId}`).set(null);
}

export function fetchPatterns () {
    return ref.child(`patterns/`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchPattern (patternId: string) {
    return ref.child(`patterns/${patternId}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchProposals () {
    return ref.child(`proposals`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchProposal (proposalId: string) {
    return ref.child(`proposals/${proposalId}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

/*
function appendProposal (roadId, proposalId) {
    return ref.child(`roadProposals/${roadId}`).once('value')
        .then((snapshot) => snapshot.val() || [])
        .then((ary) => ary.push(proposalId))
        .then((newAry) => ref.child(`roadProposals/`))
}
*/

export function saveProposal (proposal: Object) {
    const proposalId = ref.child(`proposals/${proposal.roadId}`).push().key;
    const proposalWithId = {...proposal, proposalId, currentUnits: 0};

    const promises = [
        ref.child(`proposals/${proposalId}`).set(proposalWithId),
        ref.child(`roadProposals/${proposal.roadId}/${proposalId}`).set(0),
        ref.child(`userProposals/${proposal.uid}/proposals/${proposal.roadId}/${proposalId}`).set(true),
    ];
    return Promise.all(promises).then(() => proposalWithId);
}

export function saveResponse (response: Object) {
    const responseId = ref.child(`responses/${response.dingId}/${response.questionId}`).push().key;
    const responseWithId = {...response, responseId};
    const promises = [
        ref.child(`responses/${response.dingId}/${response.questionId}/${responseId}`).set(responseWithId),
        ref.child(`userResponses/${response.uid}/${response.dingId}/${response.questionId}/${responseId}`).set(response.value),
    ];
    return Promise.all(promises).then(() => responseWithId);
}

// TODO: we are reapeating this tooooooo much!!
export function save (branchName: string, object: Object) {
    const objectId = ref.child(`${branchName}`).push().key;
    const objectWithId = {...object, objectId};
    return ref.child(`${branchName}/${objectId}`).set(objectWithId)
        .then(() => objectWithId);
}

export function saveQuestion (question: Object) {
    const questionId = ref.child(`questions`).push().key;
    const questionWithId = {...question, questionId};
    return ref.child(`questions/${questionId}`).set(questionWithId)
        .then(() => questionWithId);
}

export function fetchQuestion (questionId: string): Promise<Object> {
    return ref.child(`questions/${questionId}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchAll (branchName: string) {
    return ref.child(`${branchName}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchUserVotes (uid: string) {
    return ref.child(`userVotes/${uid}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function saveVote (uid: string, roadId: string, proposalId: string) {
    const promises = [
        ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(true),
        ref.child(`userVotes/${uid}/${roadId}`).set(proposalId),
    ];
    return Promise.all(promises);
}

export function deleteVote (uid: string, roadId: string, proposalId: string) {
    const promises = [
        ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(null),
        ref.child(`userVotes/${uid}/${roadId}`).set(null),
    ];
    return Promise.all(promises);
}

export function fetchUserResponses (uid: string) {
    return ref.child(`userResponses/${uid}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function fetchUserSettings (uid: string) {
    return ref.child(`userSettings/${uid}`).once('value')
        .then((snapshot) => snapshot.val() || {});
}

export function updateUserSettings (uid: string, variable: string, value: string | number) {
    return ref.child(`userSettings/${uid}/${variable}`).set(value);
}

export function fetchUserProposals (uid: string) {
    return ref.child(`userProposals/${uid}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchRoadProposals () {
    return ref.child(`roadProposals/`).once('value')
        .then((snapshot) => snapshot.val())
        .catch((error) => console.log(error));
}

function getChild (path: string): Promise<Object> {
    return ref.child(path).once('value')
        .then((snapshot) => snapshot.val())
        .catch((error) => {
            console.log(error);
        });
}

export function modifyBikecoin (userId: string, proposalId: string, value: number) {
    let deltaCoins = 0;
    let roadId = '';
    let newValue = 0;
    return ref.child(`userProposals/${userId}`).once('value')
        .then((snapshot) => snapshot.val().votes)
        .then((votes) => {
            if (votes) {
                const currBCUserProposal = votes[proposalId] ? votes[proposalId] : 0;
                deltaCoins = value - currBCUserProposal;
            } else {
                deltaCoins = value;
            }
        })
        // handle user proposal
        .then(() => ref.child(`userProposals/${userId}/votes/${proposalId}`).set(value))
        .then(() => getChild(`userProposals/${userId}/units`))
        .then((currentUserValue) => {
            console.log('currentUserValue0', currentUserValue);
            if (!currentUserValue && currentUserValue !== 0) {
                console.log('currentUserValue1', currentUserValue);
                currentUserValue = 100;
            }
            ref.child(`userProposals/${userId}/units`).set(currentUserValue - deltaCoins);
        })
        // handle proposals
        .then(() => getChild(`proposals/${proposalId}`))
        .then((proposal) => {
            roadId = proposal.roadId;
            return proposal.currentUnits;
        })
        .then((currentValue) => {
            newValue = currentValue + deltaCoins;
            ref.child(`proposals/${proposalId}/currentUnits`).set(newValue);
        })
        // handle road proposal
        .then(() => ref.child(`roadProposals/${roadId}/${proposalId}`).set(newValue))
        .then(() => ({deltaCoins, roadId}))
        .catch((error) => { console.log(error); });
}
