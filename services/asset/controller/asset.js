const repository = require('../repository/asset');

const postAsset = (req, next) => {

    // add code to check request for validity -- future

    // define the request object
    const request = {
        headers: req.headers,
        body: {
            rules: { rules: { roles: ['superuser', 'administrator'] } },
            values: [ req.body.assetRef, req.body.ownedByRef, req.body.name, req.body.description, req.body.operational, req.body.operationalStarDate, req.body.operationalEndDate, req.body.locationType, req.body.area, req.body.pin ]
        }
    }

    repository.postAsset(request, (err, res) => {
        if(err)
            next(err, null);
        else
            next(null, res);
    });
};

module.exports = {
    postAsset: postAsset
}