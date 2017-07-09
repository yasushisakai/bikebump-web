import axios from 'axios';
import { apiRoot, ref } from 'config/constants';
import { userDingStatus } from 'modules/userDings';

export function fetchUser (uid): Promise<any> {
    return ref.child(`users/${uid}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function createDing (lat, lng, uid, timestamp, value) {
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

export function createUserDing (uid, dingId, status = userDingStatus.DINGED, commuteId, timestamp) {
    return ref.child(`userDings/${uid}/${dingId}`).set({status, commuteId, timestamp})
        .then(() => ({uid, dingId, status}));
}

export function fetchUserDings (uid) {
    return ref.child(`userDings/${uid}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function listenToDings (callback, errorCallback) {
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

export function saveCommute (uid, breadcrumbs) {
    const commuteId = ref.child('commutes').push().key;
    const commute = {...breadcrumbs, commuteId, uid};
    return ref.child(`commutes/${commuteId}`).set(commute)
        .then(() => commute);
}

export function createCommute (uid) {
    // initiates a commute
    const commuteId = ref.child('commutes').push().key;
    return ref.child(`commutes/${commuteId}`).set({uid})
        .then(() => commuteId);
}

export function appendBreadcrumb (commuteId, coordinate, timestamp = Date.now()) {
    ref.child(`commutes/${commuteId}/${timestamp}`).set(coordinate)
        .then(() => (null));
}

export function deleteCommute (commuteId) {
    ref.child(`commutes/${commuteId}`).set(null);
}

export function fetchPatterns () {
    return ref.child(`patterns/`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchPattern (patternId) {
    return ref.child(`patterns/${patternId}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function savePattern ({patternText, budget}) {
    const patternId = ref.child('patterns').push().key;
    const newPattern = {text: patternText, budget, patternId};
    return ref.child(`patterns/${patternId}`).set(newPattern)
        .then(() => newPattern);
}

export function fetchProposals () {
    return ref.child(`proposals`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchProposal (proposalId) {
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

export function saveProposal (proposal) {
    const proposalId = ref.child(`proposals/${proposal.roadId}`).push().key;
    const proposalWithId = {...proposal, proposalId, currentUnits: 0};

    const promises = [
        ref.child(`proposals/${proposalId}`).set(proposalWithId),
        ref.child(`roadProposals/${proposal.roadId}/${proposalId}`).set(true),
        ref.child(`userProposals/${proposal.uid}/proposals/${proposal.roadId}/${proposalId}`).set
        (true),
    ];
    return Promise.all(promises).then(() => proposalWithId);
}

export function saveResponse (response) {
    const responseId = ref.child(`responses/${response.dingId}/${response.questionId}`).push().key;
    const responseWithId = {...response, responseId};
    const promises = [
        ref.child(`responses/${response.dingId}/${response.questionId}/${responseId}`).set(responseWithId),
        ref.child(`userResponses/${response.uid}/${response.dingId}/${response.questionId}/${responseId}`).set(response.value),
    ];
    return Promise.all(promises).then(() => responseWithId);
}

// TODO: we are reapeating this tooooooo much!!
export function save (branchName, object) {
    const objectId = ref.child(`${branchName}`).push().key;
    const objectWithId = {...object, objectId};
    return ref.child(`${branchName}/${objectId}`).set(objectWithId)
        .then(() => objectWithId);
}

export function saveQuestion (question) {
    const questionId = ref.child(`questions`).push().key;
    const questionWithId = {...question, questionId};
    return ref.child(`questions/${questionId}`).set(questionWithId)
        .then(() => questionWithId);
}

export function fetchQuestion (questionId) {
    return ref.child(`questions/${questionId}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchAll (branchName) {
    return ref.child(`${branchName}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchUserVotes (uid) {
    return ref.child(`userVotes/${uid}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function saveVote (uid, roadId, proposalId) {
    const promises = [
        ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(true),
        ref.child(`userVotes/${uid}/${roadId}`).set(proposalId),
    ];
    return Promise.all(promises);
}

export function deleteVote (uid, roadId, proposalId) {
    const promises = [
        ref.child(`proposals/${roadId}/${proposalId}/votes/${uid}`).set(null),
        ref.child(`userVotes/${uid}/${roadId}`).set(null),
    ];
    return Promise.all(promises);
}

export function fetchUserResponses (uid) {
    return ref.child(`userResponses/${uid}`).once('value')
        .then((snapshot) => (snapshot.val() || {}));
}

export function fetchUserSettings (uid) {
    return ref.child(`userSettings/${uid}`).once('value')
        .then((snapshot) => snapshot.val() || {});
}

export function updateUserSettings (uid, variable, value) {
    return ref.child(`userSettings/${uid}/${variable}`).set(value);
}

export function fetchUserProposals (uid) {
    return ref.child(`userProposals/${uid}`).once('value')
        .then((snapshot) => snapshot.val());
}

export function fetchRoadProposals () {
    return ref.child(`roadProposals/`).once('value')
        .then((snapshot) => snapshot.val())
        .catch((error) => console.log(error));
}

export function modifyBikecoin (userId, proposalId, value) {
    let deltaCoins = 0;
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
        .then(() => ref.child(`userProposals/${userId}/votes/${proposalId}`).set(value))
        .then(() => ref.child(`userProposals/${userId}/units`).once('value'))
        .then((ss) => ss.val())
        .then((currentUserValue) => ref.child(`userProposals/${userId}/units`).set(currentUserValue - deltaCoins))
        .then(() => ref.child(`proposals/${proposalId}/currentUnits`).once('value'))
        .then((ss) => ss.val())
        .then((currentValue) => {
            const newValue = currentValue + deltaCoins;
            ref.child(`proposals/${proposalId}/currentUnits`).set(newValue);
            return deltaCoins;
        });
}
