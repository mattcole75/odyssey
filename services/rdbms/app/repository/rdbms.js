const database = require('../../config/database');

const executeInsert = (req, next) => {
    // extract the sql from the request body
    const { sql } = req.body;
    database.getPool().query(sql, (err, res) => {
        if(err) 
            next({ status: 500, res: err }, null);
        else
            next(null, { status: 201, res: res });
    });
};

const executeSelect = (req, next) => {
    const { sql } = req.headers;
    database.getPool().query(sql, (err, res) => {
        if(err)
            next({ status: 400, res: err }, null);
        else
            next(null, { status: 200, res: res })
    });
};

module.exports = {
    executeInsert: executeInsert,
    executeSelect: executeSelect
}