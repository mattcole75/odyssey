const { get } = require('../../../../config/config');
const axios = require('../../config/axios');

const postAsset = (req, next) => {
    
    const { idtoken } = req.headers;
    const { rules, values } = req.body;
    
    const sproc = "call sp_insertAsset(" +
        (values.assetRef == null ? null + ", " : values.assetRef + ", ") + // assetRef
        (values.ownedByRef == null ? null + ", " : "'" + values.ownedByRef + "', ") + // ownedByRef
        (values.maintainedByRef == null ? null + ", " : "'" + values.maintainedByRef + "', ") + // maintainedByRef
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

const getAssets = (req, next) => {
    const { idtoken, query } = req.headers;
    const { rules } = req.body;
    //declare the sql string
    const sproc = `call sp_selectAssets('${query}')`;

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: idtoken, rules: rules, sproc: sproc } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const getAsset = (req, next) => {

    const { idtoken, param } = req.headers;
    const { rules } = req.body;
    const sproc = `call sp_selectAsset(${param})`;

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: idtoken, rules: rules, sproc: sproc } })
        .then(res => {
            next(null, { status: res.data.status, res: res.data.res[0] });
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const getChildAssets = (req, next) => {
    const { idtoken, param } = req.headers;
    const { rules } = req.body;
    //declare the sql string
    const sproc = `call sp_selectChildAssets('${param}')`;

    axios.get('/get',
        { headers: {'Content-Type': 'application/json', idToken: idtoken, rules: rules, sproc: sproc } })
        .then(res => {
            next(null, res.data);
        })
        .catch(err => {
            next(err.response.data, null);
        });
};

const patchAsset = (req, next) => {

    const { idtoken } = req.headers;
    const { rules, values } = req.body;
    const sproc = "call sp_updateAsset(" +
        (values.id == null ? null + ", " : values.id + ", ") +
        (values.ownedByRef == null ? null + ", " : "'" + values.ownedByRef + "', ") +
        (values.maintainedByRef == null ? null + ", " : "'" + values.maintainedByRef + "', ") +
        (values.locationCategoryRef == null ? null + ", " : "'" + values.locationCategoryRef + "', ") +
        (values.name == null ? null + ", " : "'" + values.name + "', ") +
        (values.description == null ? null + ", " : "'" + values.description + "', ") +
        (values.status == null ? null + ", " : "'" + values.status + "', ") +
        (values.installedDate == null ? null + ", " : "'" + values.installedDate + "', ") +
        (values.commissionedDate == null ? null + ", " : "'" + values.commissionedDate + "', ") +
        (values.decommissionedDate == null ? null + ", " : "'" + values. decommissionedDate + "', ") +
        (values.disposedDate == null ? null + ", " : "'" + values. disposedDate + "', ") +
        (values.locationType == null ? null + ", " : "'" + values. locationType + "', ") +
        (values.locationDescription == null ? null + ", " : "'" + values. locationDescription + "', ") +
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

const patchAssetLocation = (req, next) => {

    const { idtoken } = req.headers;
    const { rules, values } = req.body;

    const sproc = "call sp_updateAssetLocation(" +
        (values.id == null ? null + ", " : values.id + ", ") +
        (values.location == null ? null + ") " : "'" + values.location + "')");

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

module.exports = {
    postAsset: postAsset,
    getAssets: getAssets,
    getChildAssets: getChildAssets,
    getAsset: getAsset,
    patchAsset: patchAsset,
    patchAssetLocation: patchAssetLocation
}

