import * as actionType from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
    loading: false,
    error: null,
    users: [],
    organisations: [],
    locationCategories: [],
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
    const index = updatedOrganisations.findIndex(ele => ele.id === action.organisation.id);
    updatedOrganisations[index] = { ...updatedOrganisations[index],
        name: action.organisation.name,
        abbreviation: action.organisation.abbreviation,
        assetRole: action.organisation.assetRole,
        inuse: action.organisation.inuse };
    return { ...state, 
        organisations: updatedOrganisations
    };
}

const createOrganisationSuccess = (state, action) => {
    let updatedOrganisations = [ ...state.organisations ];
    const newOrganisation = { ...action.organisation,
        id: action.id,
        created: moment().format(),
        updated: moment().format()
    }
    updatedOrganisations.push(newOrganisation);
    return { ...state,
        organisations: updatedOrganisations
    };
}

const getLocationCategoriesSuccess = (state, action) => {
    return { ...state,
        locationCategories: action.locationCategories,
        identifier: action.identifier
    };
}

const updateLocationCategorySuccess = (state, action) => {
    let updatedLocationCategories = [ ...state.locationCategories ];
    const index = updatedLocationCategories.findIndex(ele => ele.id === action.locationCategory.id);
    updatedLocationCategories[index] = { ...updatedLocationCategories[index],
        name: action.locationCategory.name,
        description: action.locationCategory.description,
        inuse: action.locationCategory.inuse };
    return { ...state, 
        locationCategories: updatedLocationCategories
    };
}

const createLocationCategorySuccess = (state, action) => {
    let updatedLocationCategories = [ ...state.locationCategories ];
    const newLocationCategory = { ...action.locationCategory,
        id: action.id,
        created: moment().format(),
        updated: moment().format()
    }
    updatedLocationCategories.push(newLocationCategory);
    return { ...state,
        locationCategories: updatedLocationCategories
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
        case actionType.ADMIN_CREATE_ORGANISATION_SUCCESS: return createOrganisationSuccess(state, action);
        case actionType.ADMIN_GET_LOCATION_CATEGORIES_SUCCESS: return getLocationCategoriesSuccess(state, action);
        case actionType.ADMIN_UPDATE_LOCATION_CATEGORY_SUCCESS: return updateLocationCategorySuccess(state, action);
        case actionType.ADMIN_CREATE_LOCATION_CATEGORY_SUCCESS: return createLocationCategorySuccess(state, action);
        case actionType.ADMIN_FINISH: return finish(state);
        case actionType.ADMIN_FAIL: return fail(state, action);
        case actionType.ADMIN_RESET: return reset();
        default: return state;
    }
}

export default reducer;