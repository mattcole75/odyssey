import * as actionType from '../actions/actionTypes';

const initialState = {
    loading: false,
    error: null,
    idToken: null,
    localId: null,
    displayName: null,
    email: null,
    roles: [],
    identifier: null,
    redirectPath: '/'
}

const start = (state) => {
    return { ...state,
        error: null,
        loading: true
    };
}

const success = (state, action) => {
    return { ...state,
        idToken: action.idToken,
        localId: action.localId,
        displayName: action.displayName,
        email: action.email,
        roles: action.roles,
        identifier: action.identifier
    };
}

const updateDisplayName = (state, action) => {
    return { ...state,
        displayName: action.displayName,
        identifier: action.identifier
    };
}

const updateEmail = (state, action) => {
    return { ...state,
        email: action.email,
        identifier: action.identifier
    };
}

const finish = (state) => {
    return { ...state,
        loading: false,
        identifier: null
    };
}

const fail = (state, action) => {
    return { ...state,
        loading: false,
        error: action.error
    };
}

const reset = () => {
    return initialState;
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionType.AUTH_START: return start(state);
        case actionType.AUTH_SUCCESS: return success(state, action);
        case actionType.AUTH_FINISH: return finish(state);
        case actionType.AUTH_FAIL: return fail(state, action);
        case actionType.AUTH_RESET: return reset();
        case actionType.AUTH_UPDATE_DISPLAY_NAME: return updateDisplayName(state, action);
        case actionType.AUTH_UPDATE_EMAIL: return updateEmail(state, action);
        default: return state;
    }
}

export default reducer;