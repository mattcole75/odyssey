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