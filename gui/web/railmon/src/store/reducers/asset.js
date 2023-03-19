import * as actionType from '../actions/actionTypes';

const initialState = {
    loading: false,
    error: null,
    assets: [],
    asset: null,
    childAssets: [],
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

const getChildAssetsSuccess = (state, action) => {
    return { ...state,
        childAssets: action.assets,
        identifier: action.identifier
    };
}

const patchAssetSuccess = (state, action) => {
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
        case actionType.ASSET_GET_CHILD_ASSETS_SUCCESS: return getChildAssetsSuccess(state, action);
        case actionType.ASSET_PATCH_ASSET_SUCCESS: return patchAssetSuccess(state, action);
        case actionType.ASSET_FINISH: return finish(state);
        case actionType.ASSET_FAIL: return fail(state, action);
        case actionType.ASSET_RESET: return reset();
        default: return state;
    }
}

export default reducer;