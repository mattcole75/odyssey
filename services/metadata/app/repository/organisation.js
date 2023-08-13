// const { ObjectId } = require('mongodb');
// const database = require('../../config/database');
// const moment = require('moment');

const axios = require('../../config/axios');

const post = (req, next) => {
    
    const { idtoken } = req.headers;
    const { values, rules } = req.body;
    
    const sproc = "call sp_insertOrganisation(" +
        (values.name == null ? null + ", " : "'" + values.name + "', ") + // name
        (values.abbreviation == null ? null + ", " : "'" + values.abbreviation + "', ") + // description
        (values.assetRole == null ? null + ", " : "'" + values.assetRole + "', ") + // description
        "@insertId)";

    axios.post('/post',
        { rules: rules, sproc: sproc },
        { headers: { 'Content-Type': 'application/json', idToken: idtoken } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const patch = (req, next) => {

    const { idtoken } = req.headers;
    const { values, rules } = req.body;
    const sproc = "call sp_updateOrganisation(" +
        (values.id == null ? null + ", " : values.id + ", ") +
        (values.name == null ? null + ", " : "'" + values.name + "', ") +
        (values.abbreviation == null ? null + ", " : "'" + values.abbreviation + "', ") +
        (values.assetRole == null ? null + ", " : "'" + values.assetRole + "', ") +
        (values.inuse == null ? null + ") " : values.inuse + ")");

    axios.patch('/patch',
        { rules: rules, sproc: sproc },
        { headers: { 'Content-Type': 'application/json', idToken: idtoken } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const get = (req, next) => {
    const { idtoken, query, rules } = req.headers;
    //declare the sql string
    const sproc = `call sp_selectOrganisations('${query}')`;

    axios.get('/get',
        { headers: { 'Content-Type': 'application/json', idToken: idtoken, rules: JSON.stringify(rules), sproc: sproc } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const getOrganisationList = (req, next) => {
    const { idtoken, query, rules } = req.headers;
    //declare the sql string
    const sproc = `call sp_selectOrganisationList('${query}')`;

    axios.get('/get',
        { headers: { 'Content-Type': 'application/json', idToken: idtoken, rules: JSON.stringify(rules), sproc: sproc } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

module.exports = {
    post: post,
    patch: patch,
    get: get,
    getOrganisationList: getOrganisationList
}