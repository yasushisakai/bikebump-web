import { Map } from 'immutable';
const ADD_LISTENER = 'ADD_LISTENER';

export function addListener (listenerId) {
    return {
        type: ADD_LISTENER,
        listenerId,
    };
}

export default function listeners (state = Map({}), action) {
    switch (action.type) {
    case ADD_LISTENER:
        return state.merge({
            [action.listenerId]: true,
        });
    default:
        return state;
    }
}
