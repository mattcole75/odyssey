import auth from '../../axios/auth';
import admin from '../../axios/admin';
import * as actionType from './actionTypes';
import { whatIsTheErrorMessage } from '../../shared/errorMessages';

// reducer interface functions
const start = () => {
    return {
        type: actionType.ADMIN_START
    };
}

const getUsersSuccess = (users, identifier) => {
    return {
        type: actionType.ADMIN_GET_USERS_SUCCESS,
        users: users,
        identifier: identifier
    };
}

const updateUserSuccess = (user, identifier) => {
    return {
        type: actionType.ADMIN_UPDATE_USER_SUCCESS,
        user: user,
        identifier: identifier
    };
}

const getOrganisationsSuccess = (organisations, identifier) => {
    return {
        type: actionType.ADMIN_GET_ORGANISATIONS_SUCCESS,
        organisations: organisations,
        identifier: identifier
    };
}

const updateOrganisationSuccess = (organisation, identifier) => {
    return {
        type: actionType.ADMIN_UPDATE_ORGANISATION_SUCCESS,
        organisation: organisation,
        identifier: identifier
    };
}

const createOrganisationSuccess = (id, organisation, identifier) => {
    return {
        type: actionType.ADMIN_CREATE_ORGANISATION_SUCCESS,
        id: id,
        organisation: organisation,
        identifier: identifier
    };
}

const getLocationCategoriesSuccess = (locationCategories, identifier) => {
    return {
        type: actionType.ADMIN_GET_LOCATION_CATEGORIES_SUCCESS,
        locationCategories: locationCategories,
        identifier: identifier
    };
}

const updateLocationCategorySuccess = (locationCategory, identifier) => {
    return {
        type: actionType.ADMIN_UPDATE_LOCATION_CATEGORY_SUCCESS,
        locationCategory: locationCategory,
        identifier: identifier
    };
}

const createLocationCategorySuccess = (id, locationCategory, identifier) => {
    return {
        type: actionType.ADMIN_CREATE_LOCATION_CATEGORY_SUCCESS,
        id: id,
        locationCategory: locationCategory,
        identifier: identifier
    };
}

const finish = () => {
    return {
        type: actionType.ADMIN_FINISH
    };
}

const fail = (error) => {
    return {
        type: actionType.ADMIN_FAIL,
        error: error
    };
}

const reset = () => {
    return {
        type: actionType.ADMIN_RESET
    };
}

// exported functions
export const adminReset = () => {
    return dispatch => {
        dispatch(reset());
    };
}

export const adminGetUsers = (idToken, localId, query, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                localId: localId,
                query: query
            }
        };
        
        auth.get('/users', config)
            .then(res => {
                dispatch(getUsersSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            })
    };
}

export const adminUpdateUser = (idToken, localId, data, identifier) => {
    return dispatch => {
        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                localId: localId
            }
        };

        auth.patch('/admin/user', data, config)
        .then(() => {
            dispatch(updateUserSuccess(data, identifier));
        })
        .then(() => {
            dispatch(finish());
        })
        .catch(err => {
            dispatch(fail(whatIsTheErrorMessage(err))); 
        });
    };
}

export const adminGetOrganisations = (idToken, query, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                query: query
            }
        };
        
        admin.get('/organisations', config)
            .then(res => {
                dispatch(getOrganisationsSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            })
    };
}

export const adminGetOrganisationList = (idToken, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                query: ''
            }
        };
        
        admin.get('/organisationlist', config)
            .then(res => {
                dispatch(getOrganisationsSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            })
    };
}

export const adminUpdateOganisation = (idToken, data, identifier) => {

    return dispatch => {
        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken
            }
        };

        admin.patch('/organisation', data, config)
        .then(() => {
            dispatch(updateOrganisationSuccess(data, identifier));
        })
        .then(() => {
            dispatch(finish());
        })
        .catch(err => {
            dispatch(fail(whatIsTheErrorMessage(err))); 
        });
    };
}

export const adminCreateOganisation = (idToken, data, identifier) => {

    return dispatch => {
        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken
            }
        };

        admin.post('/organisation', data, config)
        .then(res => {
            const { insertId } = res.data.res;
            dispatch(createOrganisationSuccess(insertId, data, identifier));
        })
        .then(() => {
            dispatch(finish());
        })
        .catch(err => {
            dispatch(fail(whatIsTheErrorMessage(err))); 
        });
    };
}

export const adminGetLocationCategories = (idToken, query, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                query: query
            }
        };
        
        admin.get('/locationcategories', config)
            .then(res => {
                dispatch(getLocationCategoriesSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            })
    };
}

export const adminGetLocationCategoryList = (idToken, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                query: ''
            }
        };
        
        admin.get('/locationcategorylist', config)
            .then(res => {
                dispatch(getLocationCategoriesSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            })
    };
}

export const adminUpdateLocationCategory = (idToken, data, identifier) => {

    return dispatch => {
        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken
            }
        };

        admin.patch('/locationcategory', data, config)
        .then(() => {
            
            dispatch(updateLocationCategorySuccess(data, identifier));
        })
        .then(() => {
            dispatch(finish());
        })
        .catch(err => {
            dispatch(fail(whatIsTheErrorMessage(err))); 
        });
    };
}

export const adminCreateLocationCategory = (idToken, data, identifier) => {

    return dispatch => {
        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken
            }
        };

        admin.post('/locationCategory', data, config)
        .then(res => {
            const { insertId } = res.data.res;
            dispatch(createLocationCategorySuccess(insertId, data, identifier));
        })
        .then(() => {
            dispatch(finish());
        })
        .catch(err => {
            dispatch(fail(whatIsTheErrorMessage(err))); 
        });
    };
}