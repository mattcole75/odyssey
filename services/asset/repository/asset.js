const axios = require('../config/axios/axios');

const createAsset = (req, next) => {
    // declare the SQL String
    const sql = "insert into asset (assetRef, ownedByRef, name, description, operational, operationalStarDate, operationalEndDate, locationType, area, pin) values (" +
        (req.body.values[0] == null ? null + ", " : req.body.values[0] + ", ") + // assetRef
        (req.body.values[1] == null ? null + ", " : "'" + req.body.values[1] + "', ") + // ownedByRef
        (req.body.values[2] == null ? null + ", " : "'" + req.body.values[2] + "', ") + // name
        (req.body.values[3] == null ? null + ", " : "'" + req.body.values[3] + "', ") + // description
        (req.body.values[4] == null ? null + ", " : req.body.values[4] + ", ") + // operational
        (req.body.values[5] == null ? null + ", " : "'" + req.body.values[5] + "', ") + // operationalStarDate
        (req.body.values[6] == null ? null + ", " : "'" + req.body.values[6] + "', ") + // operationalEndDate
        (req.body.values[7] == null ? null + ", " : "'" + req.body.values[7] + "', ") + // locationType
        (req.body.values[8] == null ? null + ", " : "ST_PolygonFromText('" + req.body.values[8] + "'),") + // area
        (req.body.values[9] == null ? null + ") " : req.body.values[9] + ")"); // pin

        // (req.body.values[10] == null ? null + ", " : "'" + req.body.values[10] + "')"); // what3words

    axios.post('/post',
        { rules: req.body.rules, sql: sql },
        { headers: {'Content-Type': 'application/json', idToken: req.headers.idtoken } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

module.exports = {
    createAsset: createAsset
}

