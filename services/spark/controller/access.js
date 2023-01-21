const referenceToken = process.env.REFERENCE_TOKEN;

const authenticate = (req, next) => {

    if(req.headers.idtoken !== referenceToken)
        next({status: 401, err: "Yeah... Nah!"});
    else
        next(null);
};

module.exports = {
    authenticate: authenticate
}