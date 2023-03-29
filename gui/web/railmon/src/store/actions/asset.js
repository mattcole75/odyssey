import asset from '../../axios/asset';
import * as actionType from './actionTypes';
import { whatIsTheErrorMessage } from '../../shared/errorMessages';

const start = () => {
    return {
        type: actionType.ASSET_START
    };
}

const getAssetsSuccess = (assets, identifier) => {
    return {
        type: actionType.ASSET_GET_ASSETS_SUCCESS,
        assets: assets,
        identifier: identifier
    };
}

const getAssetSuccess = (asset, identifier) => {
    return {
        type: actionType.ASSET_GET_ASSET_SUCCESS,
        asset: asset,
        identifier: identifier
    };
}

const getContainedAssetsSuccess = (assets, identifier) => {
    return {
        type: actionType.ASSET_GET_CONTAINED_ASSETS_SUCCESS,
        assets: assets,
        identifier: identifier
    };
}

const patchAssetSuccess = (asset, identifier) => {
    return {
        type: actionType.ASSET_PATCH_ASSET_SUCCESS,
        asset: asset,
        identifier: identifier
    }
}

const finish = () => {
    return {
        type: actionType.ASSET_FINISH
    };
}

const fail = (error) => {
    return {
        type: actionType.ASSET_FAIL,
        error: error
    };
}

const reset = () => {
    return {
        type: actionType.ASSET_RESET
    };
}

// exported functions
export const assetReset = () => {
    return dispatch => {
        dispatch(reset());
    };
}

export const assetGetAssets = (idToken, query, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                query: query
            }
        };

        asset.get('/assets', config)
            .then(res => {
                dispatch(getAssetsSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            });
    };
}

export const assetGetAsset = (idToken, param, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                param: param
            }
        };

        asset.get('/asset', config)
            .then(res => {
                dispatch(getAssetSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            });
    };
}

export const assetGetContainedAssets = (idToken, param, identifier) => {
    return dispatch => {

        dispatch(start());

        const config = {
            headers: {
                'content-type': 'application/json',
                idToken: idToken,
                param: param
            }
        };

        asset.get('/containedassets', config)
            .then(res => {
                dispatch(getContainedAssetsSuccess(res.data.res, identifier));
            })
            .then(() => {
                dispatch(finish());
            })
            .catch(err => {
                dispatch(fail(whatIsTheErrorMessage(err)));
            });
    };
}

export const assetPatchAsset = (idToken, data, identifier) => {
    return dispatch => {
        dispatch(start());

        asset.patch('/asset', data, {
            headers: {
                idToken: idToken,
            }
        })
        .then(res => {
            dispatch(patchAssetSuccess(res.data.res, identifier));
        })
        .then(() => {
            dispatch(finish());
        })
        .catch(err => {
            dispatch(fail(whatIsTheErrorMessage(err))); 
        });
    };
}