const { ObjectId } = require('mongodb');

const postUserRules = {
    displayName: value => value.length > 0 && value.length <= 50,
    email: value => /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value),
    password: value => value.length === 64
    // password: value => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i.test(value)
}

const postLoginRules = {
    email: value => /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value),
    password: value => value.length === 64
}

const getUserRules = {
    localid: value => ObjectId.isValid(value),
    idtoken: value => value.length === 256
}

const postLogoutRules = {
    localid: value => ObjectId.isValid(value),
    idtoken: value => value.length === 256
}

const getTokenRules = {
    localid: value => ObjectId.isValid(value),
    idtoken: value => value.length === 256
}

const patchUserDisplayNameRules = {
    displayName: value => value.length > 0 && value.length <= 50
}

const patchUserEmailRules = {
    email: value => /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value),
}

const patchUserPasswordRules = {
    password: value => value.length === 64
}

const patchAdminUserRules = {
    uid: value => ObjectId.isValid(value),
    roles: value => value.constructor === Array,
    inuse: value => value.constructor === Boolean
}

const patchUserRoleRules = {
    localId: value => ObjectId.isValid(value),
    idToken: value => value.length === 256,
    roles: value => value.constructor === Array
}

const testTokenRules = {
    idtoken: value => value.length === 256
}

module.exports = {
    postUserRules: postUserRules,
    postLoginRules: postLoginRules,
    postLogoutRules: postLogoutRules,
    getUserRules: getUserRules,
    getTokenRules: getTokenRules,
    patchUserDisplayNameRules: patchUserDisplayNameRules,
    patchUserEmailRules: patchUserEmailRules,
    patchUserPasswordRules: patchUserPasswordRules,
    patchAdminUserRules: patchAdminUserRules,
    patchUserRoleRules: patchUserRoleRules,
    testTokenRules: testTokenRules
}