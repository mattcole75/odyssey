const db = require('../repository/database');
const axios = require('../config/axios/axios');

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
        return next({ status: 400, res: 'Bad Request' }, null);
    }
    //authenticate user with the auth microservice
    axios.post('/approvetransaction', { rules: rules }, { headers: header })
        .then(authRes => {
            if(authRes.data.status === 200) {
                // call the repository and execute the query
                db.executeInsert(req, (err, res) => {
                    if(err) {
                        return next(err, null);
                    } else {
                        return next(null, res);
                    }
                });
            } else {
                return(next(authRes.data, null));
            }
        })
        .catch(authErr => {
            return(next(authErr.response.data, null));
        });
};

module.exports = {
    post: post
}