const database = require('../../../configuration/database');

const executeInsert = (req, next) => {
    // extract the sql from the request body
    const { sql } = req.body;
    database.getPool().query(sql, (err, res) => {
        if(err) {
            console.log(err);
            next({ status: 500, res: err }, null);
        }
        else {
            next(null, { status: 201, res: res });
        }
    });
};

module.exports = {
    executeInsert: executeInsert
}