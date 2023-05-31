import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Search from './search/search';
import Assets from './list/assetList';
import Backdrop from '../ui/backdrop/backdrop';
import Modal from '../ui/modal/modal';
import Spinner from '../ui/spinner/spinner';
import AddAssetForm from './assetForms/addAssetForm';
import { adminGetOrganisationList, adminGetLocationCategoryList, assetCreateAsset } from '../../store/actions/index';


const assets = React.memo(() => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, assets, identifier } = useSelector(state => state.asset);
    const { idToken } = useSelector(state => state.auth);

    const [newAsset, setNewAsset] = useState(false);
    // new asset toggle
    const toggleAssetCreating = (user) => {
        setNewAsset(prevState => !prevState);
    };

    const onGetOrganisations = useCallback((idToken, identifier) => dispatch(adminGetOrganisationList(idToken, identifier)), [dispatch]);
    const onGetLocationCategories = useCallback((idToken,identifier) => dispatch(adminGetLocationCategoryList(idToken, identifier)), [dispatch]);
    const onCreateAsset = useCallback((idToken, data, identifier) => dispatch(assetCreateAsset(idToken, data, identifier)), [dispatch]);

    useEffect(() => {
        if(identifier === 'POST_ASSET'){
            toggleAssetCreating();
            navigate('/assets');
        }
            
    }, [navigate, identifier]);

    useEffect(() => {
        onGetOrganisations(idToken, 'GET_ORGS');
        onGetLocationCategories(idToken, 'GET_LOCATION_CATEGORIES');

    }, [ idToken, onGetOrganisations, onGetLocationCategories ]);

    const save = useCallback((data) => {
        onCreateAsset(idToken, data, 'POST_ASSET');
    }, [onCreateAsset, idToken]);

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
                <Assets assets={assets}  />
            </div>
        </section>
    )

});

export default assets;