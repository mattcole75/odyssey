// const { ObjectId } = require('mongodb');
// const database = require('../../config/database');
// const moment = require('moment');

const axios = require('../../config/axios');

const post = (req, next) => {
    
    const { idtoken } = req.headers;
    const { values, rules } = req.body;
    
    const sproc = "call sp_insertAssetLocationCategory(" +
        (values.name == null ? null + ", " : "'" + values.name + "', ") + // name
        (values.description == null ? null + ", " : "'" + values.description + "', ") + // description
        "@insertId)";

    axios.post('/post',
        { rules: rules, sproc: sproc },
        { headers: {'Content-Type': 'application/json', idToken: idtoken } })
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
    const sproc = "call sp_updateAssetLocationCategory(" +
        (values.id == null ? null + ", " : values.id + ", ") +
        (values.name == null ? null + ", " : "'" + values.name + "', ") +
        (values.description == null ? null + ", " : "'" + values.description + "', ") +
        (values.inuse == null ? null + ") " : values.inuse + ")");

    axios.patch('/patch',
        { rules: rules, sproc: sproc },
        { headers: {'Content-Type': 'application/json', idToken: idtoken } })
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
    const sproc = `call sp_selectAssetLocationCategories('${query}')`;

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: idtoken, rules: JSON.stringify(rules), sproc: sproc } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const getLocationCategoryList = (req, next) => {
    const { idtoken, query, rules } = req.headers;
    //declare the sql string
    const sproc = `call sp_selectAssetLocationCategoryList('${query}')`;

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: idtoken, rules: JSON.stringify(rules), sproc: sproc } })
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
    getLocationCategoryList: getLocationCategoryList
}