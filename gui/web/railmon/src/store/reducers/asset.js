import * as actionType from '../actions/actionTypes';
import moment from 'moment';

const initialState = {
    loading: false,
    error: null,
    assets: [],
    asset: null,
    containedAssets: [],
    identifier: null,
    redirectPath: '/assets'
}

const start = (state) => {
    return { ...state,
        error: null,
        loading: true
    };
}

const getAssetsSuccess = (state, action) => {
    return { ...state,
        assets: action.assets,
        asset: null,
        childAssets: [],
        identifier: action.identifier
    };
}

const getAssetSuccess = (state, action) => {
    return { ...state,
        asset: action.asset,
        identifier: action.identifier
    };
}

const getContainedAssetsSuccess = (state, action) => {
    return { ...state,
        containedAssets: action.assets,
        identifier: action.identifier
    };
}

const createAssetSuccess = (state, action) => {
    let updatedAssets = [ ...state.assets ];
    const newAsset = { ...action.asset,
        id: action.id,
        status: 'design',
        created: moment().format(),
        updated: moment().format()
    }
    updatedAssets.push(newAsset);
    return { ...state,
        assets: updatedAssets,
        identifier: action.identifier
    };
}

const updateAssetSuccess = (state, action) => {
    return { ...state,
        asset: action.asset,
        identifier: action.identifier
    };
}

const finish = (state) => {
    return { ...state,
        loading: false,
        identifier: null
    };
}

const fail = (state, action) => {
    return { ...state,
        loading: false,
        error: action.error
    };
}

const reset = () => {
    return initialState;
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionType.ASSET_START: return start(state);
        case actionType.ASSET_GET_ASSETS_SUCCESS: return getAssetsSuccess(state, action);
        case actionType.ASSET_GET_ASSET_SUCCESS: return getAssetSuccess(state, action);
        case actionType.ASSET_GET_CONTAINED_ASSETS_SUCCESS: return getContainedAssetsSuccess(state, action);
        case actionType.ASSET_CREATE_ASSET_SUCCESS: return createAssetSuccess(state, action);
        case actionType.ASSET_UPDATE_ASSET_SUCCESS: return updateAssetSuccess(state, action);
        case actionType.ASSET_FINISH: return finish(state);
        case actionType.ASSET_FAIL: return fail(state, action);
        case actionType.ASSET_RESET: return reset();
        default: return state;
    }
}

export default reducer;