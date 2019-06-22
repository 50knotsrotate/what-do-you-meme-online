import { createStore } from 'redux';

export const CREATE_GAME = 'CREATE_GAME';
export const UPDATE_GAME = 'UPDATE_GAME'
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

const reducer = (state = {}, action) => { //Game will be created on the back end
    const { type, payload } = action;

    switch (type) { 
        case CREATE_GAME:
            return { payload }
        case UPDATE_GAME:
            return { ...state, payload }
        case SET_CURRENT_USER:
            return {...state, current_user: payload}
        default:
            return state
    }
};

export default createStore(reducer);