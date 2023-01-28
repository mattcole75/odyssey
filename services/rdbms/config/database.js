const mySql = require('mysql');
const config = require('./config');

let state = {
    pool: null
};

exports.connect = (done) => {
    state.pool = mySql.createPool(config.get('db'));
    done();
};

exports.getPool = () => {
    return state.pool;
}