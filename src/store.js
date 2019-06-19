import { createStore } from 'redux';

const initialState = {
    pin: null,
    players: [],
    cards: [],
    chosenCards: [],
    game_ended: false
}

export const CREATE_GAME = 'CREATE_GAME';

const reducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) { 
        case CREATE_GAME:
            return { ...state, payload }
        default:
            return state
    }
};