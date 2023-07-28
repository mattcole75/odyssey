const { ObjectId } = require('mongodb');

const isAuthenticatedRules = {
    localid: value => ObjectId.isValid(value),
    idtoken: value => value.length === 256
}

const userPostUserRules = {
    displayName: value => value.length > 2 && value.length <= 64,
    email: value => value.length > 5 && /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value),
    password: value => value.length === 64
}

const userPatchUserEmailVerifiedRules = {
    idtoken: value => value.length === 256
}

const userLoginUserRules = {
    email: value => value.length > 5 && /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value),
    password: value => value.length === 64
}

const userLogoutUserRules = {
    localid: value => ObjectId.isValid(value),
    idtoken: value => value.length === 256
}

const userGetUserRules = {
    localid: value => ObjectId.isValid(value),
    idtoken: value => value.length === 256
}

const userPatchUserDisplayNameRules = {
    displayName: value => value.length > 2 && value.length <= 64
}

const userPatchUserEmailRules = {
    email: value => value.length > 5 && /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value)
}

const userPatchUserPasswordRules = {
    password: value => value.length === 64
}

const userPostUserForgottenPasswordRules = {
    email: value => value.length > 5 && /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/.test(value)
}

const adminGetUsersRules = {
    localid: value => ObjectId.isValid(value),
    idtoken: value => value.length === 256
}

const adminPatchUserRules = {
    uid: value => ObjectId.isValid(value),
    roles: value => value.constructor === Array,
    inuse: value => value.constructor === Boolean
}

const approveTransactionRules = {
    idtoken: value => value.length === 256
}

module.exports = {
    isAuthenticatedRules: isAuthenticatedRules,
    userPostUserRules: userPostUserRules,
    userPatchUserEmailVerifiedRules: userPatchUserEmailVerifiedRules,
    userLoginUserRules: userLoginUserRules,
    userLogoutUserRules: userLogoutUserRules,
    userGetUserRules: userGetUserRules,
    userPatchUserDisplayNameRules: userPatchUserDisplayNameRules,
    userPatchUserEmailRules: userPatchUserEmailRules,
    userPatchUserPasswordRules: userPatchUserPasswordRules,
    userPostUserForgottenPasswordRules: userPostUserForgottenPasswordRules,
    adminGetUsersRules: adminGetUsersRules,
    adminPatchUserRules: adminPatchUserRules,
    approveTransactionRules: approveTransactionRules
}