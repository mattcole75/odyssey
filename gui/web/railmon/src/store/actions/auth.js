import axios from '../../axios/auth';
import * as actionType from './actionTypes';
import {whatIsTheErrorMessage} from '../../shared/errorMessages';

// reducer interface functions

const start = () => {
    return {
        type: actionType.AUTH_START
    };
};

const success = (idToken, localId, email, displayName, roles, avatarUrl, identifier) => {
    return {
        type: actionType.AUTH_SUCCESS,
        idToken: idToken,
        localId: localId,
        email: email,
        displayName: displayName,
        roles: roles,
        avatarUrl: avatarUrl,
        identifier: identifier
    };
};

const finish = () => {
    return {
        type: actionType.AUTH_FINISH
    };
};

const fail = (error) => {
    return {
        type: actionType.AUTH_FAIL,
        error: error
    };
};

const reset = () => {
    return {
        type: actionType.AUTH_RESET
    };
};

const avatarUrlUpdate = (idToken, avatarUrl, identifier) => {
    return {
        type: actionType.AUTH_UDATE_AVATAR_URL,
        avatarUrl: avatarUrl,
        idToken: idToken,
        identifier: identifier
    };
};

const avatarUrlDelete = (idToken, avatarUrl, identifier) => {
    return {
        type: actionType.AUTH_DELETE_AVATAR_URL,
        avatarUrl: avatarUrl,
        idToken: idToken,
        identifier: identifier
    };
};

const displayNameUpdate = (displayName, identifier) => {
    return {
        type: actionType.AUTH_UPDATE_DISPLAY_NAME,
        displayName: displayName,
        identifier: identifier
    };
};

const emailUpdate = (email, identifier) => {
    return {
        type: actionType.AUTH_UPDATE_EMAIL,
        email: email,
        identifier: identifier
    };
};

const passwordUpdate = (identifier) => {
    return {
        type: actionType.AUTH_UPDATE_PASSWORD,
        identifier: identifier
    };
}

// private functions
const deleteLocalStorage = () => {

    localStorage.removeItem('idToken');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('localId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    localStorage.removeItem('avatarUrl');
};

const setLocalStorage = (authData) => {

    const expirationDate = new Date(new Date().getTime() + authData.expiresIn * 1000);
    localStorage.setItem('idToken', authData.idToken);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('localId', authData.localId);
    localStorage.setItem('email', authData.email);
    localStorage.setItem('displayName', authData.displayName);
    localStorage.setItem('roles', JSON.stringify(authData.roles));
    localStorage.setItem('avatarUrl', authData.avatarUrl);
};

// exported functions

export const logout = () => {

    const idToken = localStorage.getItem('idToken');
    const localId = localStorage.getItem('localId');

    return dispatch => {

        if (idToken && localId) {

            dispatch(start());

            axios.post('/user/logout', {}, { 
                headers: {
                    'content-type': 'application/json',
                    idToken: idToken,
                    localId: localId
                }
            })
            .then(() => {
                deleteLocalStorage();
                dispatch(reset());
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err))); 
            });
        }
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout({}));
        }, expirationTime * 1000);
    };
};

export const login = (authData, identifier) => {
    return dispatch => {

        dispatch(start());

        axios.post('/user/login', authData)
            .then(res => {
                setLocalStorage(res.data.user);
                dispatch(success(
                    res.data.user.idToken, 
                    res.data.user.localId, 
                    res.data.user.email, 
                    res.data.user.displayName,
                    res.data.user.roles,
                    res.data.user.avatarUrl,
                    identifier
                ));

                dispatch(checkAuthTimeout(res.data.user.expiresIn));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err))); 
            });
    };
};

export const signup = (authData, identifier) => {
    return dispatch => {

        dispatch(start());

        axios.post('/user', authData)
            .then(res => {
                
                setLocalStorage(res.data.user);

                dispatch(success(
                    res.data.user.idToken, 
                    res.data.user.localId, 
                    res.data.user.email, 
                    res.data.user.displayName,
                    res.data.user.roles,
                    res.data.user.avatarUrl,
                    identifier
                ));

                dispatch(checkAuthTimeout(res.data.user.expiresIn));

                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err))); 
            });
    };
};

export const passwordRequest = (authData, identifier) => {
    return dispatch => {

        dispatch(start());

        const url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyC6PitjCMHh2egZo3zKkrq86IOiMMr-N1E';

        axios.post(url, authData)
            .then(response => {
                
                dispatch(success(
                    null, 
                    null, 
                    response.data.email,
                    null,
                    null,
                    identifier));

                dispatch(finish());

            })
            .catch(error => {
                dispatch(fail(whatIsTheErrorMessage(error)));
            });
    };
};

export const updateDisplayName = (data, idToken, localId, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = { 
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                localId: localId
            }
        };

        axios.patch('/user/displayname', data, config)
            .then(() => {
                dispatch(displayNameUpdate(data.displayName, identifier));
                localStorage.setItem('displayName', data.displayName);
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err))); 
            });
    };
};

export const updateEmail = (data, idToken, localId, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = { 
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                localId: localId
            }
        };

        axios.patch('/user/email', data, config)
            .then(() => {
                dispatch(emailUpdate(data.email, identifier));
                localStorage.setItem('email', data.email);
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err))); 
            });
    };
};

export const updatePassword = (password, idToken, localId, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = { 
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                localId: localId
            }
        };

        axios.patch('/user/password', { password: password }, config)
            .then(() => {
                dispatch(passwordUpdate(identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err))); 
            });
    };
};

export const updateAccount = (authData, idToken, localId, identifier) => {
    return dispatch => {

        dispatch(start());
            
        let url = '/user';

        let config = { 
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                localId: localId
            }
        };

        axios.patch(url, authData, config)
            .then(response => {
                switch (identifier) {

                    case 'DISPLAY_NAME_CHANGE':
                        dispatch(displayNameUpdate(
                            response.data.user.idToken,
                            response.data.user.displayName,
                            identifier
                        ));

                        localStorage.setItem('idToken', response.data.user.idToken);
                        localStorage.setItem('displayName', response.data.user.displayName);

                        break;
                    case 'EMAIL_CHANGE':
                        dispatch(emailUpdate(
                            response.data.user.idToken,
                            response.data.user.email,
                            identifier
                        ));
                            
                        localStorage.setItem('idToken', response.data.user.idToken);
                        localStorage.setItem('email', response.data.user.email);
                        
                        break;
                    case 'PASSWORD_CHANGE':
                        dispatch(passwordUpdate(
                            response.data.user.idToken,
                            identifier
                        ));
                            
                        localStorage.setItem('idToken', response.data.user.idToken);
                        
                        break;
                    default:
                        throw new Error('Auth Actions POST Acount update Switch');
                    
                }

                dispatch(finish());

            })
            .catch(error => {
                dispatch(fail(whatIsTheErrorMessage(error))); 
            });
    };
}

export const updateAvatar = (avatarData, idToken, localId, identifier) => {
    return dispatch => {
        dispatch(start());
            
        let url = '/user/avatar';

        let config = { 
            headers: {
                'content-type': 'multipart/form-data',
                idToken: idToken,
                localId: localId
            }
        };

        axios.patch(url, avatarData, config)
            .then(response => {

            dispatch(avatarUrlUpdate(
                response.data.user.idToken,
                response.data.user.avatarUrl,
                identifier
            ));

            localStorage.setItem('idToken', response.data.user.idToken);
            localStorage.setItem('avatarUrl', response.data.user.avatarUrl);

            dispatch(finish());

        })
        .catch(error => {
            dispatch(fail(whatIsTheErrorMessage(error))); 
        });
    }
}

export const deleteAvatar = (idToken, localId, identifier) => {
    return dispatch => {
        dispatch(start());
            
        let url = '/user/avatar';

        let config = { 
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                localId: localId
            }
        };

        axios.delete(url, config)
            .then(response => {

            dispatch(avatarUrlDelete(
                response.data.user.idToken,
                response.data.user.avatarUrl,
                identifier
            ));

            localStorage.setItem('idToken', response.data.user.idToken);
            localStorage.setItem('avatarUrl', response.data.user.avatarUrl);

            dispatch(finish());

        })
        .catch(error => {
            dispatch(fail(whatIsTheErrorMessage(error))); 
        });
    }
}

export const authCheckState = () => {
    return dispatch => {
        const idToken = localStorage.getItem('idToken');
        const localId = localStorage.getItem('localId');
        const email = localStorage.getItem('email');
        const displayName = localStorage.getItem('displayName');
        const roles = JSON.parse(localStorage.getItem('roles'));
        const avatarUrl = localStorage.getItem('avatarUrl');

        if (!idToken) {
            dispatch(logout({}));
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()){
                dispatch(logout({}));
                dispatch(reset());
            } else {
                dispatch(success(idToken, localId, email, displayName, roles, avatarUrl, 'AUTH_CHECK_STATE'));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
                dispatch(finish());
            } 
        }
    };
};