const axios = require('../../config/axios');

const postAsset = (req, next) => {
    
    const { rules } = req.body;
    // declare the SQL String
    const sql = "insert into asset (assetRef, ownedByRef, maintainedByRef, name, description, operational, operationalStarDate, operationalEndDate, locationType, area, pin) values (" +
        (req.body.values[0] == null ? null + ", " : req.body.values[0] + ", ") + // assetRef
        (req.body.values[1] == null ? null + ", " : "'" + req.body.values[1] + "', ") + // ownedByRef
        (req.body.values[2] == null ? null + ", " : "'" + req.body.values[2] + "', ") + // maintainedByRef
        (req.body.values[3] == null ? null + ", " : "'" + req.body.values[3] + "', ") + // name
        (req.body.values[4] == null ? null + ", " : "'" + req.body.values[4] + "', ") + // description
        (req.body.values[5] == null ? null + ", " : req.body.values[5] + ", ") + // operational
        (req.body.values[6] == null ? null + ", " : "'" + req.body.values[6] + "', ") + // operationalStarDate
        (req.body.values[7] == null ? null + ", " : "'" + req.body.values[7] + "', ") + // operationalEndDate
        (req.body.values[8] == null ? null + ", " : "'" + req.body.values[8] + "', ") + // locationType
        (req.body.values[9] == null ? null + ", " : "ST_PolygonFromText('" + req.body.values[9] + "'),") + // area
        (req.body.values[10] == null ? null + ") " : req.body.values[10] + ")"); // pin

        // (req.body.values[10] == null ? null + ", " : "'" + req.body.values[10] + "')"); // what3words

    axios.post('/post',
        { rules: rules, sql: sql },
        { headers: {'Content-Type': 'application/json', idToken: req.headers.idtoken } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const getAssets = (req, next) => {
    const { idtoken } = req.headers;
    const { rules } = req.body;
    //declare the sql string
    const sql = "select id, assetRef, ownedByRef, maintainedByRef, name, operational from asset";

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: req.headers.idtoken, rules: rules, sql: sql } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

module.exports = {
    postAsset: postAsset,
    getAssets: getAssets
}

