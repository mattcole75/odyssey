const config = require('../../configuration/config');
const service = config.get('service');
const version = config.get('version');
const con = require('../controller/guardian');

module.exports = (app) => {

    app.get('/' + service + '/api/' + version, (req, res) => {
        res.status(200).send({'msg': 'service is up!'});
    });

    app.post('/' + service + '/api/' + version + '/user', (req, res) => {
        con.userPostUser(req, (err, result) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(result.status).send(result);
        });
    });

    app.patch('/' + service + '/api/' + version + '/verifyemail', (req, res) => {
        con.userPatchUserEmailVerified(req, (err, result) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(result.status).send(result);
        });
    });

    app.post('/' + service + '/api/' + version + '/user/login', (req, res) => {
        con.userLoginUser(req, (err, auth) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(auth.status).send(auth);
        });
    });

    app.post('/' + service + '/api/' + version + '/user/logout', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user'],
            allowSameUser: true
        }

        con.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                con.userLogoutUser(req, (err, auth) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(auth.status).send(auth);
                });
            }
        });
    });

    app.get('/' + service + '/api/' + version + '/user', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user'],
            allowSameUser: true
        }

        con.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                con.userGetUser(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.patch('/' + service + '/api/' + version + '/user/displayname', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user'],
            allowSameUser: true
        }

        con.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                con.userPatchUserDisplayName(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.patch('/' + service + '/api/' + version + '/user/email', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user'],
            allowSameUser: true
        }

        con.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                con.userPatchUserEmail(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.patch('/' + service + '/api/' + version + '/user/password', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user'],
            allowSameUser: true
        }

        con.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                con.userPatchUserPassword(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.post('/' + service + '/api/' + version + '/user/forgottenpassword', (req, res) => {
        con.userPostUserForgottenPassword(req, (err, result) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(result.status).send(result);
        });
    });

    app.get('/' + service + '/api/' + version + '/admin/users', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['administrator']
        }

        con.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                con.adminGetUsers(req, (err, users) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(users.status).send(users);
                });
            }
        });
    });

    app.patch('/' + service + '/api/' + version + '/admin/user', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['administrator']
        }

        con.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                con.adminPatchUser(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.post('/' + service + '/api/' + version + '/approvetransaction', (req, res) => {
        // will not authenticate user as the function is only checking the token
        // must check the rules of the requesting API endpoint
        con.approveTransaction(req, (err, token) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(token.status).send(token);
        });
    });
}