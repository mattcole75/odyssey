const auth = require('../repository/auth');
const log = require('../../utility/logger')();
const crypto = require('crypto');
const config = require('../../configuration/config');
const version = config.get('version');
const validate = require('../../validation/validate');
const { postUserRules, postLoginRules, getUserRules, postLogoutRules, getTokenRules, patchUserDisplayNameRules, patchUserEmailRules, patchUserPasswordRules, patchUserRoleRules, testTokenRules, patchAdminUserRules } = require('../../validation/rules');
const moment = require('moment');
const { genHash, genToken } = require('../../utility/auth');
const { ObjectId } = require('mongodb');
const adminEmail = config.get('adminEmail');


const postUser = (req, next) => {

    const errors = validate(req.body, postUserRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - postUser - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {

        const salt = crypto.randomBytes(256);
        const hash = genHash(req.body.password, salt);

        auth.postUser(
            {   ...req.body,
                password: hash,
                salt: salt.toString('hex'),
                inuse: true,
                lastLoggedIn: null,
                logInCount: 0,
                roles: ['user'],
                updated: moment().format(),
                created: moment().format()
            }, 
            (err, user) => {
            if(err) {
                log.error(`POST v${version} - failed - postUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            }
            else {
                auth.authenticate(req.body, (err, result) => {
                    if(err) {
                        log.error(`POST v${version} - failed - login - status: 400, msg: ${err.msg}`);
                        next(err, null);
                    } else {
                        const params = { localId: result.data._id, idToken: genToken(), lastLoggedIn: moment().format()};
                        auth.patchToken(params, (err, idToken) => {
                            if(err) {
                                log.error(`POST v${version} - failed - login - status: ${err.status} msg: ${err.msg}`);
                                next(err, null);
                            } else {
                                next(null, {
                                    status: user.status,
                                    user: {
                                        localId: result.data._id,
                                        displayName: result.data.displayName,
                                        email: result.data.email,
                                        idToken: idToken.idToken,
                                        roles: result.data.roles,
                                        expiresIn: 3600
                                    }
                                });
                            }
                        });
        
                    }
                });

                // log.info(`POST v${version} - success - postuser - status: ${user.status}`);
                //next(null, user);
            }
        });
    }
}

const login = (req, next) => {

    const errors = validate(req.body, postLoginRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - login - status: 400 msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        auth.authenticate(req.body, (err, result) => {
            if(err) {
                log.error(`POST v${version} - failed - login - status: 400, msg: ${err.msg}`);
                next(err, null);
            } else {
                const params = { localId: result.data._id, idToken: genToken(), lastLoggedIn: moment().format()};
                auth.patchToken(params, (err, idToken) => {
                    if(err) {
                        log.error(`POST v${version} - failed - login - status: ${err.status} msg: ${err.msg}`);
                        next(err, null);
                    } else {
                        next(null, {
                            status: result.status,
                            user: {
                                idToken: idToken.idToken,
                                localId: result.data._id,
                                displayName: result.data.displayName,
                                email: result.data.email,
                                roles: result.data.roles,
                                expiresIn: 3600
                            }
                        });
                    }
                });

            }
        });
    }
}

const getUser = (req, next) => {

    const { localid, idtoken } = req.headers;

    let errors = [];

    if(localid && localid != null && idtoken && idtoken != null) {
        errors = validate(req.headers, getUserRules);
    } else {
        log.error(`POST v${version} - validation failure - getUser - status: 400, msg: request header parameters missing`);
        return next({status: 400, msg: 'Bad request - validation failure'}, null);
    }
    
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - getUser - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        auth.getUser(req.headers, (err, result) => {
            if(err) {
                log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, {
                    status: result.status,
                    user: {
                        localId: result.data._id,
                        displayName: result.data.displayName,
                        email: result.data.email,
                        roles: result.data.roles
                    }
                });
            }
        });
    }
}

const getUsers = (req, next) => {

    const { localid, idtoken, query } = req.headers;

    let errors = [];

    if(localid && localid != null && idtoken && idtoken != null) {
        errors = validate(req.headers, getUserRules);
    } else {
        log.error(`POST v${version} - validation failure - getUser - status: 400, msg: request header parameters missing`);
        return next({status: 400, msg: 'Bad request - validation failure'}, null);
    }
    
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - getUser - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        auth.getUsers(query, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                // console.log(res);
                next(null, res);
            }
        });
    }
}

const logout = (req, next) => {

    const { localid, idtoken } = req.headers;

    const errors = validate(req.headers, postLogoutRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - logout - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken};
        auth.removeToken(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const authorise = (req, authenticated, rules, next) => {

    const id = new ObjectId(req.headers.localid);
    const { roles, email, _id } = authenticated;
    // const { roles, allowSameUser } = rules;
    

    if (email === adminEmail){
        // console.log('adminEmail', email, adminEmail);
        return next(null, { status: 200, message: 'OK' });
    }
    
    // if (allowSameUser && id && _id === id) {
    if (rules.allowSameUser && id && _id.equals(id)) {
        // console.log('allow same user', allowSameUser, id, _id);
        return next(null, { status: 200, message: 'OK' });
    }
         
    if (!roles) {
        // console.log('no role', role);
        return next({ status: 403, message: 'Forbidden' }, null);
    }
         
    // if(role.every(r => roles.includes(r))) {
    if(rules.roles.every(r => roles.includes(r))) {
        // console.log('role compliance', roles, role);
        return next(null, { status: 200, message: 'OK'});
    }

    // console.log('NO MATCH');
    // console.log('role', role);
    // console.log('roles', roles);
    // console.log('allowSameUser', allowSameUser);
    // console.log('email', email);
    // console.log('_id', _id);
    // console.log('id', id);
    return next( { status: 403, message: 'Forbidden' }, null);
}

const isAuthenticated = (req, rules, next) => {

    const { localid, idtoken } = req.headers;

    let errors = [];

    if (localid && localid != null && localid !== null && localid !== '' && localid !== 'null' &&
        idtoken && idtoken != null && idtoken !== null && idtoken !== '' && idtoken !== 'null') {
        errors = validate(req.headers, getTokenRules);
    } else {
        log.error(`POST v${version} - validation failure - isAuthenticated - status: 401, msg: request header parameters missing`);
        return next({ status: 401, msg: 'Unauthorised' }, null);
    }

    if (errors.length > 0) {
        log.error(`POST v${version} - validation failure - isAuthenticated - status: 400, msg: ${errors}`);
        return next({ status: 400, msg: 'Bad request - validation failure' }, null);
    } else {
        const params = { idToken: idtoken, localId: localid };
        auth.isAuthenticated(params, (err, auth) => {
            if(err) {
                log.error(`POST v${version} - failed - isAuthenticated - status: ${err.status} msg: ${err.msg}`);
                return next(err, null);
            } else {
                authorise(req, auth.data, rules, (err, res) => {
                    if (err)
                        return next(err, null);
                    else
                        return next(null, res);
                });
            }
        });
    }
}

const patchUserDisplayName = (req, next) => {

    const { localid, idtoken } = req.headers;
    const { displayName } = req.body;

    const errors = validate(req.body, patchUserDisplayNameRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - patch display name - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken, data: { displayName: displayName, updated: moment().format() } };
        auth.patchUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - patchUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const patchUserEmail = (req, next) => {

    const { localid, idtoken } = req.headers;
    const { email } = req.body;

    const errors = validate(req.body, patchUserEmailRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - patch user email - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken, data: { email: email, updated: moment().format() } };
        auth.patchUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - patchUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const patchUserPassword = (req, next) => {

    const { localid, idtoken } = req.headers;
    const { password } = req.body;

    const errors = validate(req.body, patchUserPasswordRules);

    const salt = crypto.randomBytes(256);
    const hash = genHash(password, salt);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - patch user password - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken, data: { salt: salt.toString('hex'), password: hash, updated: moment().format() } };
        auth.patchUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - patchUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const patchAdminUser = (req, next) => {

    const { uid, roles, inuse } = req.body;
    console.log('uid', uid);
    console.log('roles', roles);
    console.log('inuse', inuse);

    const errors = validate(req.body, patchAdminUserRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - patch user status - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        const params = { uid: uid, data: { roles: roles, inuse: inuse, updated: moment().format() } };
        auth.patchAdminUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - patchUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

// const patchUserRole = (req, next) => {

//     const { localId, idToken, roles } = req.body;

//     const errors = validate(req.body, patchUserRoleRules);

//     if(errors.length > 0) {
//         log.error(`POST v${version} - validation failure - patch user roles - status: 400, msg: ${errors}`);
//         next({status: 400, msg: 'Bad request - validation failure'}, null);
//     } else {
//         const params = { localId: localId, idToken: idToken, data: { roles: roles, updated: moment().format() } };
//         auth.patchUserRole(params, (err, res) => {
//             if(err) {
//                 log.error(`POST v${version} - failed - patchUser - status: ${err.status} msg: ${err.msg}`);
//                 next(err, null);
//             } else {
//                 next(null, res);
//             }
//         });
//     }
// }

const approveTransaction = (req, next) => {

    const { idtoken } = req.headers;
    const { rules } = req.body;

    let errors = [];
    if(idtoken && idtoken != null) {
        errors = validate(req.headers, testTokenRules);
    } else {
        log.error(`POST v${version} - validation failure - testToken - status: 400, msg: request header parameters missing`);
        return next({status: 400, msg: 'Bad request - validation failure'}, null);
    }
    
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - testToken - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'Bad request - validation failure'}, null);
    } else {
        auth.approveTransaction(idtoken, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - testToken - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                authorise(req, res.data, rules, (err, res) => {
                    if (err)
                        return next(err, null);
                    else
                        return next(null, res);
                });
            }
        });
    }
}

module.exports = {
    postUser: postUser,
    login: login,
    getUser: getUser,
    getUsers:  getUsers,
    logout: logout,
    isAuthenticated: isAuthenticated,
    patchUserDisplayName: patchUserDisplayName,
    patchUserEmail: patchUserEmail,
    patchUserPassword: patchUserPassword,
    patchAdminUser: patchAdminUser,
    // patchUserRole: patchUserRole,
    approveTransaction: approveTransaction
}