const config = require('../../configuration/config');
const service = config.get('service');
const version = config.get('version');
const auth = require('../controller/auth');

module.exports = (app) => {

    app.get('/' + service + '/api/' + version, (req, res) => {
        res.status(200).send({'msg': 'Server is up!'});
    });

    app.post('/' + service + '/api/' + version + '/user', (req, res) => {
        auth.postUser(req, (err, user) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(user.status).send(user);
        });
    });

    app.post('/' + service + '/api/' + version + '/user/login', (req, res) => {
        auth.login(req, (err, auth) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(auth.status).send(auth);
        });
    });

    app.get('/' + service + '/api/' + version + '/user', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user', 'administrator'],
            allowSameUser: true
        }

        auth.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                auth.getUser(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.get('/' + service + '/api/' + version + '/users', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['administrator']
        }

        auth.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                auth.getUsers(req, (err, users) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(users.status).send(users);
                });
            }
        });
    });

    app.post('/' + service + '/api/' + version + '/user/logout', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user', 'administrator'],
            allowSameUser: true
        }

        auth.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                auth.logout(req, (err, auth) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(auth.status).send(auth);
                });
            }
        });
    });

    app.patch('/' + service + '/api/' + version + '/user/displayname', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['user', 'administrator'],
            allowSameUser: true
        }

        auth.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                auth.patchUserDisplayName(req, (err, user) => {
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
            roles: ['user', 'administrator'],
            allowSameUser: true
        }

        auth.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                auth.patchUserEmail(req, (err, user) => {
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
            roles: ['user', 'administrator'],
            allowSameUser: true
        }

        auth.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                auth.patchUserPassword(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    app.patch('/' + service + '/api/' + version + '/admin/user', (req, res) => {
        res.set('Content-Type', 'application/json');

        const rules = {
            roles: ['administrator']
        }

        auth.isAuthenticated(req, rules, (err) => {
            if(err)
                res.status(err.status).send(err);
            else {
                auth.patchAdminUser(req, (err, user) => {
                    if(err)
                        res.status(err.status).send(err);
                    else
                        res.status(user.status).send(user);
                });
            }
        });
    });

    // app.patch('/' + service + '/api/' + version + '/user/role', (req, res) => {
    //     res.set('Content-Type', 'application/json');

    //     const rules = {
    //         roles: ['administrator']
    //     }

    //     auth.isAuthenticated(req, rules, (err) => {
    //         if(err)
    //             res.status(err.status).send(err);
    //         else {
    //             auth.patchUserRole(req, (err, user) => {
    //                 if(err)
    //                     res.status(err.status).send(err);
    //                 else
    //                     res.status(user.status).send(user);
    //             });
    //         }
    //     });
    // });

    app.post('/' + service + '/api/' + version + '/approvetransaction', (req, res) => {
        // will not authenticate user as the function is only checking the token
        // must check the rules of the requesting API endpoint
        auth.approveTransaction(req, (err, token) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(token.status).send(token);
        });
    });
}