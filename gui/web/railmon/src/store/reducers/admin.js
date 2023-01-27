import * as actionType from '../actions/actionTypes';

const initialState = {
    loading: false,
    error: null,
    users: [],
    organisations: [],
    identifier: null,
    redirectPath: '/admin/users'
}

const start = (state) => {
    return { ...state,
        error: null,
        loading: true
    };
}

const getUsersSuccess = (state, action) => {
    return { ...state,
        users: action.users,
        identifier: action.identifier
    };
}

const updateUserSuccess = (state, action) => {
    let updatedUsers = [ ...state.users];
    const index = updatedUsers.findIndex(ele => ele._id === action.user.uid);
    updatedUsers[index] = { ...updatedUsers[index], roles: action.user.roles, inuse: action.user.inuse };

    return { ...state,
        users: updatedUsers
    };
}

const getOrganisationsSuccess = (state, action) => {
    return { ...state,
        organisations: action.organisations,
        identifier: action.identifier
    };
}

const updateOrganisationSuccess = (state, action) => {
    let updatedOrganisations = [ ...state.organisations ];
    const index = updatedOrganisations.findIndex(ele => ele._id === action.organisation.uid);
    updatedOrganisations[index] = { ...updatedOrganisations[index], name: action.organisation.name, assetRole: action.organisation.assetRole, inuse: action.organisation.inuse };
    return { ...state, 
        organisations: updatedOrganisations
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
        case actionType.ADMIN_START: return start(state);
        case actionType.ADMIN_GET_USERS_SUCCESS: return getUsersSuccess(state, action);
        case actionType.ADMIN_UPDATE_USER_SUCCESS: return updateUserSuccess(state, action);
        case actionType.ADMIN_GET_ORGANISATIONS_SUCCESS: return getOrganisationsSuccess(state, action);
        case actionType.ADMIN_UPDATE_ORGANISATION_SUCCESS: return updateOrganisationSuccess(state, action);
        case actionType.ADMIN_FINISH: return finish(state);
        case actionType.ADMIN_FAIL: return fail(state, action);
        case actionType.ADMIN_RESET: return reset();
        default: return state;
    }
}

export default reducer;