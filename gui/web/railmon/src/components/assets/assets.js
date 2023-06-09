import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Search from './search/search';
import Assets from './list/assetList';
import Backdrop from '../ui/backdrop/backdrop';
import Modal from '../ui/modal/modal';
import Spinner from '../ui/spinner/spinner';
import AddAssetForm from './assetForms/addAssetForm';
import { adminGetOrganisationList, adminGetLocationCategoryList, assetCreateAsset, assetDeleteAsset } from '../../store/actions/index';
import DeleteAssetForm from './assetForms/deleteAssetForm';


const assets = React.memo(() => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, assets, identifier } = useSelector(state => state.asset);
    const { idToken } = useSelector(state => state.auth);

    const [ newAsset, setNewAsset ] = useState(false);
    const [ deletingAssetId, setDeletingAssetId ] = useState(null);
    const [ deletingAsset, setDeletingAsset ] = useState(false);
    // new asset toggle
    const toggleAssetCreating = (user) => {
        setNewAsset(prevState => !prevState);
    };

    const toggleAssetDeleting = (id) => {
        setDeletingAssetId(id);
        setDeletingAsset(prevState => !prevState);
    };

    const onGetOrganisations = useCallback((idToken, identifier) => dispatch(adminGetOrganisationList(idToken, identifier)), [dispatch]);
    const onGetLocationCategories = useCallback((idToken,identifier) => dispatch(adminGetLocationCategoryList(idToken, identifier)), [dispatch]);
    const onCreateAsset = useCallback((idToken, data, identifier) => dispatch(assetCreateAsset(idToken, data, identifier)), [dispatch]);
    const onDeleteAsset = useCallback((idToken, id, identifier) => dispatch(assetDeleteAsset(idToken, id, identifier)), [dispatch]);

    useEffect(() => {
        if(identifier === 'POST_ASSET'){
            toggleAssetCreating();
            navigate('/assets');
        } else if (identifier === 'DELETE_ASSET') {
            toggleAssetDeleting();
        }
            
    }, [navigate, identifier]);

    useEffect(() => {
        onGetOrganisations(idToken, 'GET_ORGS');
        onGetLocationCategories(idToken, 'GET_LOCATION_CATEGORIES');

    }, [ idToken, onGetOrganisations, onGetLocationCategories ]);

    const save = useCallback((data) => {
        onCreateAsset(idToken, data, 'POST_ASSET');
    }, [onCreateAsset, idToken]);

    const deleteAsset = useCallback(() => {
        onDeleteAsset(idToken, deletingAssetId, 'DELETE_ASSET');
    }, [deletingAssetId, idToken, onDeleteAsset]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />;
    
    // model add new asset
    let modal = null;
    if(newAsset) {
        modal = <Modal 
            show={newAsset}
            modalClosed={ toggleAssetCreating }
            content={
                <AddAssetForm 
                    toggle={ toggleAssetCreating }
                    save={ save }
                />
            }/>
    }

    if(deletingAsset) {
        modal = <Modal
                    show={ deletingAsset }
                    modalClosed={ toggleAssetDeleting }
                    content={
                        <DeleteAssetForm
                            id={ deletingAssetId }
                            deleteAsset={ deleteAsset }
                            toggle={ toggleAssetDeleting }
                        />
                    } />
    }

    
    return (
        <section>
            <Backdrop show={loading} />
            {spinner}
            {error &&
                <div className='container alert alert-danger text-center' role='alert'>
                    {error}
                </div>
            }
            { modal }
            <div className='u-margin-bottom-small'>
                <Search newAssetHandler={ toggleAssetCreating } />
            </div>

            <div>
                <Assets assets={assets} toggleAssetDeleting={ toggleAssetDeleting } />
            </div>
        </section>
    )

});

export default assets;