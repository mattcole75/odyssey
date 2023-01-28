const db = require('../repository/rdbms');
const axios = require('../../config/axios');
const log = require('../../logs/logger')();
const config = require('../../config/config');
const version = config.get('version');

const post = (req, next) => {
    // pull the token and access rules from the request
    const { idtoken } = req.headers;
    const { rules } = req.body;
    // declare local header variable
    let header;
    // build header
    if(idtoken) {
        header = {
            'Content-Type': 'application/json',
            idToken: idtoken
        }
    } else {
        log.error(`status: ${ err.status } POST db v${ version } result: no idToken`);
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    // authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                // call the repository and execute the query
                db.executeInsert(req, (err, res) => {
                    if(err) {
                        log.error(`status: ${ err.status } POST db v${ version } result: ${ JSON.stringify(err) }`);
                        return next(err, null);
                    } else {
                        log.info(`status: ${res.status} POST db v${version}`);
                        return next(null, res);
                    }
                });
            } else {
                log.error(`status: ${ authRes.status } POST db v${ version } result: ${ JSON.stringify(authRes.statusText) }`);
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            log.error(`status: ${ authErr.status } POST db v${ version } result: ${ JSON.stringify(authErr.statusText) }`);
            return(next(authErr.response.data, null));
        });
};

module.exports = {
    post: post
}