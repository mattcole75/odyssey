import axios from '../../axios/auth';
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
        
        axios.get('/users', config)
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

        axios.patch('/admin/user', data, config)
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