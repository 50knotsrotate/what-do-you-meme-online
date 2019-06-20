import { createStore } from 'redux';

export const CREATE_GAME = 'CREATE_GAME';
export const UPDATE_GAME = 'UPDATE_GAME'

const reducer = (state = {}, action) => { //Game will be created on the back end
    const { type, payload } = action;

    switch (type) { 
        case CREATE_GAME:
            return { payload }
        case UPDATE_GAME:
            return {...state, payload}
        default:
            return state
    }
};

export default createStore(reducer);