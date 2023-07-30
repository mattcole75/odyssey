const repo = require('../repository/guardian');
const log = require('../../utility/logger')();
const crypto = require('crypto');
const config = require('../../configuration/config');
const version = config.get('version');
const validate = require('../../validation/validate');
const validationRules = require('../../validation/rules');
const moment = require('moment');
const { genHash, genToken } = require('../../utility/auth');
const { ObjectId } = require('mongodb');
const adminEmail = config.get('adminEmail');

const authorise = (req, authenticated, rules, next) => {

    const id = new ObjectId(req.headers.localid);
    const { roles, email, _id } = authenticated;
    // const { roles, allowSameUser } = rules;

    if (email === adminEmail){
        // console.log('adminEmail', email, adminEmail);
        return next(null, { status: 200, message: 'OK' });
    }
    
    // if (allowSameUser && id && _id === id) {
    // if (rules.allowSameUser && id && _id.equals(id)) {
    //     // console.log('allow same user', allowSameUser, id, _id);
    //     return next(null, { status: 200, message: 'OK' });
    // }
         
    if (!roles) {
        // console.log('no role', role);
        return next({ status: 403, message: 'forbidden' }, null);
    }
    
    // if(role.every(r => roles.includes(r))) {
    if(rules.roles.every(r => roles.includes(r))) {
        // console.log('role compliance', roles, role);
        return next(null, { status: 200, message: 'OK'});
    }

     // if(role.every(r => roles.includes(r))) {
    // console.log('rules', rules);
    // console.log('roles', roles);

    // if(roles.some(el => rules.roles.includes(el)))
    // if(rules.roles.some(el => roles.includes(el)))
    //     return next(null, { status: 200, message: 'OK'});

    // if(rules.roles.some(r=> roles.indexOf(r) >= 0)) {
    //     // if(rules.roles.every(r => roles.includes(r))) {
    //         // console.log('role compliance', roles, role);
    //         return next(null, { status: 200, message: 'OK'});
    //     }

    // console.log('NO MATCH');
    // console.log('role', role);
    // console.log('roles', roles);
    // console.log('allowSameUser', allowSameUser);
    // console.log('email', email);
    // console.log('_id', _id);
    // console.log('id', id);
    return next( { status: 403, message: 'forbidden' }, null);
}

const isAuthenticated = (req, rules, next) => {

    const { localid, idtoken } = req.headers;

    let errors = [];

    if (localid && localid != null && localid !== null && localid !== '' && localid !== 'null' &&
        idtoken && idtoken != null && idtoken !== null && idtoken !== '' && idtoken !== 'null') {
        errors = validate(req.headers, validationRules.isAuthenticatedRules);
    } else {
        log.error(`POST v${version} - validation failure - isAuthenticated - status: 401, msg: request header parameters missing`);
        return next({ status: 401, msg: 'unauthorised' }, null);
    }

    if (errors.length > 0) {
        log.error(`POST v${version} - validation failure - isAuthenticated - status: 400, msg: ${errors}`);
        return next({ status: 400, msg: 'bad request' }, null);
    } else {
        const params = { idToken: idtoken, localId: localid };
        repo.isAuthenticated(params, (err, auth) => {
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

const userPostUser = (req, next) => {
    // check the user input is valid
    const errors = validate(req.body, validationRules.userPostUserRules);
    // return and log any errors found through the validation process
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userPostUser - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        // generate a salt value
        const salt = crypto.randomBytes(256);
        // hash the password with the salt
        const hash = genHash(req.body.password, salt);
        //generate email verification token
        const verificationToken = genToken();
        // insert new user into the database
        repo.createUser(
            {   ...req.body,
                emailVerified: false,
                password: hash,
                salt: salt.toString('hex'),
                inuse: false,
                lastLoggedIn: null,
                logInCount: 0,
                roles: ['user'],
                updated: moment().format(),
                created: moment().format(),
                idToken: verificationToken
            },
            (err, res) => {
            if(err) {
                // log and return error
                log.error(`POST v${version} - failed - userPostUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            }
            else {
                // log and return success
                // log.info(`POST v${version} - success - userPostuser - status: ${JSON.stringify(req.body)}`);
                next(null, res);
            }
        });
    }
}

const userPatchUserEmailVerified = (req, next) => {

    const { idtoken } = req.headers;
    const { verified } = req.body;

    const errors = validate(req.headers, validationRules.userPatchUserEmailVerifiedRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userPatchUserEmailVerified - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        const params = { idToken: idtoken, verified: verified };
        repo.updateEmailVerification(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - userPatchUserEmailVerified - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const userLoginUser = (req, next) => {

    const errors = validate(req.body, validationRules.userLoginUserRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userLoginUser - status: 400 msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        repo.authenticate(req.body, (err, result) => {
            if(err) {
                log.error(`POST v${version} - failed - userLoginUser - status: ${err.status}, msg: ${err.msg}`);
                next(err, null);
            } else {
                const params = { localId: result.data._id, idToken: genToken(), lastLoggedIn: moment().format() };
                repo.updateToken(params, (err, idToken) => {
                    if(err) {
                        log.error(`POST v${version} - failed - userLoginUser - status: ${err.status} msg: ${err.msg}`);
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

const userLogoutUser = (req, next) => {

    const { localid, idtoken } = req.headers;

    const errors = validate(req.headers, validationRules.userLogoutUserRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userLogoutUser - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken};
        repo.deleteToken(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - userLogoutUser - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const userGetUser = (req, next) => {

    const { localid, idtoken } = req.headers;

    let errors = [];

    if(localid && localid != null && idtoken && idtoken != null) {
        errors = validate(req.headers, validationRules.userGetUserRules);
    } else {
        log.error(`POST v${version} - validation failure - userGetUser - status: 400, msg: request header parameters missing`);
        return next({status: 400, msg: 'bad request'}, null);
    }
    
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userGetUser - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        repo.selectUser(req.headers, (err, result) => {
            if(err) {
                log.error(`POST v${version} - failed - userGetUser - status: ${err.status} msg: ${err.msg}`);
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

const userPatchUserDisplayName = (req, next) => {

    const { localid, idtoken } = req.headers;
    const { displayName } = req.body;

    const errors = validate(req.body, validationRules.userPatchUserDisplayNameRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userPatchUserDisplayName - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken, data: { displayName: displayName, updated: moment().format() } };
        repo.updateUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - userPatchUserDisplayName - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const userPatchUserEmail = (req, next) => {

    const { localid, idtoken } = req.headers;
    const { email } = req.body;

    const errors = validate(req.body, validationRules.userPatchUserEmailRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userPatchUserEmail - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken, data: { email: email, updated: moment().format() } };
        repo.updateUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - userPatchUserEmail - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const userPatchUserPassword = (req, next) => {

    const { localid, idtoken } = req.headers;
    const { password } = req.body;

    const errors = validate(req.body, validationRules.userPatchUserPasswordRules);

    const salt = crypto.randomBytes(256);
    const hash = genHash(password, salt);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userPatchUserPassword - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        const params = { localId: localid, idToken: idtoken, data: { salt: salt.toString('hex'), password: hash, updated: moment().format() } };
        repo.updateUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - userPatchUserPassword - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const userPostUserForgottenPassword = (req, next) => {

    const { email } = req.body;
    // check the user input is valid
    const errors = validate(req.body, validationRules.userPostUserForgottenPasswordRules);
    // return and log any errors found through the validation process
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - userPostUserForgottenPassword - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        const params = { email: email };
        repo.selectUserByEmail(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - userPostUserForgottenPassword - status: ${err.status} msg: ${err.msg}`);
                next(null, { status: 200, msg: 'ok' });
            } else {
                const params = { localId: res.data._id, idToken: genToken(), lastLoggedIn: moment().format() };
                repo.updateToken(params, (err, idToken) => {
                    if(err) {
                        log.error(`POST v${version} - failed - userPostUserForgottenPassword - status: ${err.status} msg: ${err.msg}`);
                        next(null, { status: 200, msg: 'ok' });
                    } else {
                        //todo start email process with following info
                        console.log({
                            idToken: idToken.idToken,
                            localId: res.data._id
                        });
                        next(null, { status: 200, msg: 'ok' });
                    }
                });
            }
        });
    }
}

const adminGetUsers = (req, next) => {

    const { localid, idtoken, query } = req.headers;

    let errors = [];

    if(localid && localid != null && idtoken && idtoken != null) {
        errors = validate(req.headers, validationRules.adminGetUsersRules);
    } else {
        log.error(`POST v${version} - validation failure - adminGetUsers - status: 400, msg: request header parameters missing`);
        return next({status: 400, msg: 'bad request'}, null);
    }
    
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - adminGetUsers - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        repo.selectUsers(query, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - adminGetUsers - status: ${err.status} msg: ${err.msg}`);
                next(err, null);
            } else {
                const users = new Array();
                res.res.forEach(user => {
                    let usr = {
                        localId: user._id,
                        displayName: user.displayName,
                        email: user.email,
                        roles: user.roles,
                        inuse: user.inuse,
                        lastLoggedInDate: user.lastLoggedInDate,
                        logInCount: user.logInCount,
                        updated: user.updated,
                        created: user.created
                    }
                    users.push(usr);
                });

                next(null, {
                    status: res.status,
                    users: users
                })
            }
        });
    }
}

const adminPatchUser = (req, next) => {

    const { uid, roles, inuse } = req.body;

    const errors = validate(req.body, validationRules.adminPatchUserRules);

    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - adminPatchUser - status: 400, msg: ${ errors }`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        const params = { uid: uid, data: { roles: roles, inuse: inuse, updated: moment().format() } };
        repo.adminUpdateUser(params, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - adminPatchUser - status: ${err.status} msg: ${ err.msg }`);
                next(err, null);
            } else {
                next(null, res);
            }
        });
    }
}

const approveTransaction = (req, next) => {

    const { idtoken } = req.headers;
    const { rules } = req.body;

    let errors = [];
    if(idtoken != null) {
        errors = validate(req.headers, validationRules.approveTransactionRules);
    } else {
        log.error(`POST v${version} - validation failure - approveTransaction - status: 400, msg: request header parameters missing`);
        return next({status: 400, msg: 'bad request'}, null);
    }
    
    if(errors.length > 0) {
        log.error(`POST v${version} - validation failure - approveTransaction - status: 400, msg: ${errors}`);
        next({status: 400, msg: 'bad request'}, null);
    } else {
        repo.approveTransaction(idtoken, (err, res) => {
            if(err) {
                log.error(`POST v${version} - failed - approveTransaction - status: ${err.status} msg: ${err.msg}`);
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
    isAuthenticated: isAuthenticated,
    userPostUser: userPostUser,
    userPatchUserEmailVerified: userPatchUserEmailVerified,
    userLoginUser: userLoginUser,
    userLogoutUser: userLogoutUser,
    userGetUser: userGetUser,
    userPatchUserDisplayName: userPatchUserDisplayName,
    userPatchUserEmail: userPatchUserEmail,
    userPatchUserPassword: userPatchUserPassword,
    userPostUserForgottenPassword: userPostUserForgottenPassword,
    adminGetUsers:  adminGetUsers,
    adminPatchUser: adminPatchUser,
    approveTransaction: approveTransaction
}