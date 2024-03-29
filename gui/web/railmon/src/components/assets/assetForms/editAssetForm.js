import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { assetGetAsset, assetGetContainedAssets, assetUpdateAsset, assetCreateAsset, assetUpdateAssetLocationMap, assetUpdateAssetAllocation, assetDeleteContainedAsset } from '../../../store/actions/index';

import { useForm } from 'react-hook-form';
import ContainedAssets from './containedAssetList/containedAssetList';
import LocationView from './location/locationView';
// import assetRoles from '../../../../config/lists/assetRoles';
import moment from 'moment';

import Backdrop from '../../ui/backdrop/backdrop';
import Modal from '../../ui/modal/modal';
import Spinner from '../../ui/spinner/spinner';

import LocationEdit from './location/locationEdit';
import AddAssetForm from './addAssetForm';
import Reallocation from './reallocation/reallocation';
import DeleteAssetForm from './deleteAssetForm';


import { capitalizeFirstLetter } from '../../../shared/utility';

const EditAssetForm = () => {

    const { id } = useParams();
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, asset, containedAssets, identifier } = useSelector(state => state.asset);
    const { idToken } = useSelector(state => state.auth);
    const { organisations, locationCategories } = useSelector(state => state.admin);

    const [ inuseStatus, setInuseStatus ] = useState(asset != null ? asset.inuse : true);
    const [ editingMap, setEditingMap ] = useState(false);
    const [ addingAsset, setAddingAsset ] = useState(false);
    const [ reallocatingAsset, setReallocatingAsset ] = useState(false);
    const [ deletingAssetId, setDeletingAssetId ] = useState(null);
    const [ deletingAsset, setDeletingAsset ] = useState(false);
    

    const onGetAsset = useCallback((idToken, id, identifier) => dispatch(assetGetAsset(idToken, id, identifier)), [dispatch]);
    const onGetContainedAssets = useCallback((idToken, id, identifier) => dispatch(assetGetContainedAssets(idToken, id, identifier)), [dispatch]);
    const onUpdateAsset = useCallback((idToken, data, identifier) => dispatch(assetUpdateAsset(idToken, data, identifier)), [dispatch]);
    const onCreateAsset = useCallback((idToken, data, identifier) => dispatch(assetCreateAsset(idToken, data, identifier)), [dispatch]);
    const onUpdateLocationMap = useCallback((idToken, id, data, identifier) => dispatch(assetUpdateAssetLocationMap(idToken, id, data, identifier)), [dispatch]);
    const onUpdateAssetAllocation = useCallback((idToken, id, data, identifier) => dispatch(assetUpdateAssetAllocation(idToken, id, data, identifier)), [dispatch]);
    const onDeleteContainedAsset = useCallback((idToken, id, containingID, identifier) => dispatch(assetDeleteContainedAsset(idToken, id, containingID, identifier)), [dispatch]);

    const { register, reset, getValues, formState: { errors } } = useForm({ mode: 'onChange' });

    // editing map toggle
    const toggleMapEditing = () => {
        setEditingMap(prevState => !prevState);
    };

    // adding asset toggle
    const toggleAssetAdding = () => {
        setAddingAsset(prevState => !prevState);
    };

    const toggleAssetReallocation = () => {
        setReallocatingAsset(prevState => !prevState);
    };

    const toggleAssetDeleting = (id) => {
        setDeletingAssetId(id);
        setDeletingAsset(prevState => !prevState);
    };
    
    // load asset details on page refresh given an id
    useEffect(() => {
        if(Number.isInteger(parseInt(id))) {
            onGetAsset(idToken, id, 'GET_ASSET');
            onGetContainedAssets(idToken, id, 'GET_CHILD_ASSETS');
        } else {
            navigate('/')
        }
    }, [id, idToken, navigate, onGetAsset, onGetContainedAssets]);

    useEffect(() => {
        if(identifier === 'POST_CONTAINED_ASSET') {
            onGetContainedAssets(idToken, id, 'GET_CHILD_ASSETS');
            toggleAssetAdding();
        } else if (identifier === 'DELETE_ASSET') {
            toggleAssetDeleting();
        }
            
    }, [id, idToken, identifier, onGetContainedAssets]);

    // watch for a change to the asset pointer and reset the form.
    useEffect(() => {
        reset(asset);
    }, [asset, reset]);
    
    const patch = useCallback(() => {
        if(asset !== null) { // edit
            const { ownedByRef, maintainedByRef,locationCategoryRef, name, description, status, installedDate, commissionedDate, decommissionedDate, disposedDate, locationType, locationDescription } = getValues();
            onUpdateAsset(idToken, { ...asset,
                id: id,
                ownedByRef: ownedByRef === '' ? null : parseInt(ownedByRef),
                maintainedByRef: maintainedByRef === '' ? null : parseInt(maintainedByRef),
                locationCategoryRef: locationCategoryRef === '' ? null : parseInt(locationCategoryRef),
                name: name,
                description: description,
                status: status,
                installedDate: installedDate === '' ? null : installedDate,
                commissionedDate: commissionedDate === '' ? null : commissionedDate,
                decommissionedDate: decommissionedDate === '' ? null : decommissionedDate,
                disposedDate: disposedDate === '' ? null : disposedDate,
                locationType: locationType === '' ? null : locationType,
                locationDescription: locationDescription === '' ? null : locationDescription,
                inuse: inuseStatus === false ? false : true
             }, 'PATCH_ASSET'); // update
        } 
        // else { // new asset
        //     save({ ...data });
        // }
    }, [asset, getValues, id, idToken, inuseStatus, onUpdateAsset]);

    const post = useCallback((data) => {
        onCreateAsset(idToken, data, 'POST_CONTAINED_ASSET');
    }, [onCreateAsset, idToken]);

    const saveMap = useCallback((data) => {
        onUpdateLocationMap(idToken, id, { location: data }, 'PATCH_ASSET_LOCATION_MAP');
    }, [onUpdateLocationMap, id, idToken]);

    const patchAssetAllocation = useCallback((data) => {
        onUpdateAssetAllocation(idToken, id, data, 'PATCH_ASSET_ALLOCATION');
    }, [idToken, id, onUpdateAssetAllocation]);

    const deleteContainedAsset = useCallback(() => {
        onDeleteContainedAsset(idToken, deletingAssetId, id,  'DELETE_ASSET');
    }, [deletingAssetId, idToken, id, onDeleteContainedAsset]);

    const toggleInuseStatus = () => {
        setInuseStatus(prevState => !prevState);
    }

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    // modal edit map
    let modal = null;
    if(editingMap) {
        modal = <Modal
            show={ editingMap }
            modalClosed={ toggleMapEditing }
            content={
                <LocationEdit
                    asset={ asset }
                    close={ toggleMapEditing }
                    save={ saveMap }
                />
            } />
    }

    if(addingAsset) {
        modal = <Modal
                    show={ addingAsset }
                    modalClosed={ toggleAssetAdding }
                    content={
                        <AddAssetForm 
                            toggle={ toggleAssetAdding }
                            save={ post }
                            containerId={id}
                            containerName={asset.name}
                        />
                    } />
    }

    if(reallocatingAsset) {
        modal = <Modal
                    show={ reallocatingAsset }
                    modalClosed={ toggleAssetReallocation }
                    content={
                        <Reallocation
                            save={ patchAssetAllocation }
                            parent={ asset.parent }
                            toggle={ toggleAssetReallocation }
                        />
                    } />
    }

    if(deletingAsset) {
        modal = <Modal
                    show={ deletingAsset }
                    modalClosed={ toggleAssetDeleting }
                    content={
                        <DeleteAssetForm
                            id={ deletingAssetId }
                            deleteAsset={ deleteContainedAsset }
                            toggle={ toggleAssetDeleting }
                        />
                    } />
    }    

    return (
        <div className='form-admin container'>
             <Backdrop show={ loading } />
            { spinner }
            { error &&
                <div className='container alert alert-danger text-center' role='alert'>
                    { error }
                </div>
            }
            { modal }
            
            {/* heading */}
            <form>
                {/* asset details */}
                <div className='row g-2 mb-2'>
                    <div className='d-flex gap-2 w-100 justify-content-between mt-3'>
                        <div className='text-start'>
                            <h1 className='h3 mb-3 fw-normal text-start'>Asset Details</h1>
                        </div>
                        { asset
                            ?   <small className='opacity-75 text-nowrap'>
                                    { asset.status === 'commissioned'
                                        ?   <span className='badge text-end bg-success'>{ capitalizeFirstLetter(asset.status) }</span>
                                        :   <span className='badge text-end bg-warning'>{ capitalizeFirstLetter(asset.status) }</span>
                                    }
                                </small>
                            :   null 
                        }
                    </div>
                    <div className='col-sm-6'>
                        <div className='input-group'>
                            <div className='form-floating col-sm-9'>
                                <input type='text' className='form-control form-auth-ele-top' id='name' placeholder='Asset name' autoComplete='off' required minLength={3} maxLength={50}
                                { ...register('name', {
                                    required: 'You must specify an Asset Name',
                                    minLength: {
                                        value: 3,
                                        message: 'Asset Name must have at least 3 characters'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Asset Name must have less than 50 characters'
                                    }
                                }) }
                                />
                                <label htmlFor='name'>Asset Name</label>
                            </div>

                            <div className='col-sm-3'>
                                <span className="input-group-text h-100 form-auth-ele-top-right" id="basic-addon1">ID: { id }</span>
                            </div>

                        </div>

                        <div className='input-group mb-3'>  
                            <div className='form-floating col-sm-9'>
                                <input type='text' className='form-control form-auth-ele-bot-left mb-0' id='assetRef' placeholder='Asset Reference' autoComplete='off' readOnly value={ asset && asset.parent ? asset.parent : 'Top Level Asset' } />
                                <label htmlFor='assetRef'>Parent Asset</label>
                            </div>
                            <div className='col-sm-3'>
                                 <button className='form-control btn btn-outline-secondary h-100 form-auth-ele-bot-right mb-0' type='button' onClick={ toggleAssetReallocation }>Reallocate</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='form-floating'>
                            <select className='form-select form-auth-ele-top' id='ownedByRef' aria-label='Asset status'
                                { ...register('ownedByRef', { required: 'You must select an owner organisation' }) }
                            >
                                <option value=''>Select...</option>
                                {
                                    organisations && organisations.map(item => {
                                        if(item.assetRole === 'Owner')
                                            return (<option key={item.id} value={item.id}>{item.name}</option>)
                                        else
                                            return null;
                                    })
                                }
                                
                            </select>
                            <label htmlFor='ownedByRef'>Asset Owner</label>
                        </div>
                        <div className='form-floating'>
                            <select className='form-select form-auth-ele-bot' id='maintainedByRef' aria-label='Asset status'
                                { ...register('maintainedByRef', { required: 'You must select a maintainer organisation' }) }
                            >
                                <option value=''>Select...</option>
                                {
                                    organisations && organisations.map(item => {
                                        if(item.assetRole === 'Maintainer')
                                            return (<option key={item.id} value={item.id}>{item.name}</option>)
                                        else
                                            return null;
                                    })
                                }
                                
                            </select>
                            <label htmlFor='maintainedByRef'>Asset Maintainer</label>
                        </div>
                    </div>

                    <div className='form-floating'>
                        <textarea className='form-control' id='description' placeholder='Asset Description' rows='5' required minLength={3} maxLength={256}  style={{height:'auto'}}
                            { ...register('description', {
                                required: 'You must provide an asset description',
                                minLength: {
                                    value: 3,
                                    message: 'Asset description must have at least 3 characters'
                                },
                                maxLength: {
                                    value: 256,
                                    message: 'Asset description cannot have more than 256 characters'
                                }
                            }) }
                        />
                        <label htmlFor='description'>Asset Description</label>
                    </div>
                </div>
                { errors.name && <p className='form-auth-error mt-1'>{errors.name.message}</p> }
                { errors.description && <p className='form-auth-error mt-1'>{errors.description.message}</p> }

                {/* Asset Status */}
                <div className='row g-2 mb-2'>
                    <div className='d-flex gap-2 w-100 justify-content-between mt-3'>
                        <div className='text-start'>
                            <h1 className='h3 mb-3 fw-normal text-start'>Asset Status</h1>
                        </div>
                        { asset
                            ?   <small className='opacity-75 text-nowrap'>
                                    { asset.inuse 
                                        ?   <span className='badge text-end bg-success'>Enabled</span>
                                        :   <span className='badge text-end bg-danger'>Disabled</span>
                                    }
                                </small>
                            :   null 
                        }
                    </div>

                    <div className='col-sm-6'>
                        <div className='form-floating'>
                            <select className='form-select form-auth-ele-top' id='status' aria-label='Asset status'
                                { ...register('status', { required: 'You must select a status' }) }
                            >
                                <option value=''>Select...</option>
                                <option value='design'>Design</option>
                                <option value='procure'>Procure</option>
                                <option value='installed'>Installed</option>
                                <option value='commissioned'>Commissioned</option>
                                <option value='decommissioned'>Decommissioned</option>
                                <option value='disposed'>Disposed</option>
                            </select>
                            <label htmlFor='status'>Asset Status</label>
                        </div>
                        <div className='form-floating'>
                            <input type='date' className='form-control form-auth-ele-mid' id='installedDate' placeholder='Installed Date'
                            { ...register('installedDate') }
                            />
                            <label htmlFor='installedDate'>Installed Date</label>
                        </div>

                        <div className='form-floating'>
                            <input type='date' className='form-control form-auth-ele-bot' id='commissionedDate' placeholder='Commissioned Date'
                            { ...register('commissionedDate') }
                            />
                            <label htmlFor='commissionedDate'>Commissioned Date</label>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='form-floating'>
                            <select className='form-select form-auth-ele-top' id='inuse' aria-label='Asset status' required
                                { ...register('inuse', { onChange: toggleInuseStatus, required: 'You must select an enabled status' })}
                            >
                                <option value=''>Select...</option>
                                <option value={1}>Enabled</option>
                                <option value={0}>Disabled</option>
                            </select>
                            <label htmlFor='inuse'>Asset Enabled Status</label>
                        </div>

                        <div className='form-floating'>
                            <input type='date' className='form-control form-auth-ele-mid' id='decommissionedDate' placeholder='decommissioned Date'
                            { ...register('decommissionedDate') }
                            />
                            <label htmlFor='decommissionedDate'>Decommissioned Date</label>
                        </div>

                        <div className='form-floating'>
                            <input type='date' className='form-control form-auth-ele-bot' id='disposedDate' placeholder='Disposed Date'
                            { ...register('disposedDate') }
                            />
                            <label htmlFor='disposedDate'>Disposed Date</label>
                        </div>
                    </div>
                </div>
                { errors.assetStatus && <p className='form-auth-error mt-1'>{errors.assetStatus.message}</p> }
                { errors.inuse && <p className='form-auth-error mt-1'>{errors.inuse.message}</p> }

                {/* Location Section */}
                <div className='row g-2 mb-2'>
                    <div className='text-start'>
                        <h1 className='h3 fw-normal text-start'>Location</h1>
                    </div>

                    <div className='col-sm-6'>
                        <div className='form-floating'>
                            <select className='form-select' id='locationType' aria-label='Location Type'
                                { ...register('locationType') }
                            >
                                <option value=''>Select...</option>
                                <option value='area'>Area</option>
                                <option value='point'>Point</option>
                            </select>
                            <label htmlFor='locationType'>Location Type</label>
                        </div>
                    </div>

                    <div className='col-sm-6'>
                        <div className='form-floating'>
                            <select className='form-select' id='locationCategoryRef' aria-label='Location Category'
                                { ...register('locationCategoryRef') }
                            >
                                <option value=''>Select...</option>
                                {
                                    locationCategories && locationCategories.map(item => {
                                       return (<option key={item.id} value={item.id}>{item.name}</option>)
                                    })
                                }
                                
                            </select>
                            <label htmlFor='locationCategoryRef'>Location Category</label>
                        </div>
                    </div>

                    <div className='form-floating'>
                        <textarea className='form-control' id='locationDescription' placeholder='Location Description' rows='2' required minLength={3} maxLength={256}  style={{height:'auto'}}
                            { ...register('locationDescription') }
                        />
                        <label htmlFor='locationDescription'>Location Description</label>
                    </div>
                    
                    {/* asset map section */}
                    <div className='d-flex gap-2 w-100 justify-content-between mt-3'>
                        <div className='text-start'>
                            <h1 className='h3 mb-3 fw-normal text-start'>Map</h1>
                        </div>
                        { asset && asset.location
                            ?   <button
                                    className='btn btn-outline-primary mb-2'
                                    type='button'
                                    onClick={ toggleMapEditing }>Edit Map</button>
                            :    <button
                                    className='btn btn-outline-primary mb-1'
                                    type='button'
                                    onClick={ toggleMapEditing }>Add Map</button>
                        }
                    </div>
                    { asset && asset.location
                            ?   <div className='mb-3'>
                                    <LocationView asset={ asset } />
                                </div>
                            :   null
                        }
                    
                </div>

                {/* contained asset list */}
                {asset && asset.locationType === 'area'
                    ?   <div className='mb-3'>
                            <div className='d-flex gap-2 w-100 justify-content-between'>
                                <div className='text-start'>
                                    <h1 className='h3 mb-3 fw-normal text-start'>Contained Assets</h1>
                                </div>

                                <button
                                    className='btn btn-outline-primary mb-3'
                                    type='button'
                                    onClick={ toggleAssetAdding }>Add Asset</button>
                            </div>
                            <div className='mb-3'>
                                <ContainedAssets assets={ containedAssets } toggle={ toggleAssetDeleting } />
                            </div>
                        </div>
                    
                    :   null
                }
                
                
               
                {/* record details section */}
                <div className='row g-2 mb-4'>
                    <div className='text-start'>
                        <h1 className='h3 mb-3 fw-normal text-start'>Record Details</h1>
                    </div>
                    <div className='col-sm-6'>
                        { asset
                            ?   <div className=''>
                                    <div className='form-control'>
                                        <h6 className='my-0'>Date Created</h6>
                                        <small className='text-muted'>{moment(asset.created).format('MMMM Do YYYY, h:mm:ss a')}</small>
                                    </div>
                                </div>
                            :   null
                        }

                    </div>
                    <div className='col-sm-6'>
                        { asset
                            ?   <div className=''>
                                    <div className='form-control'>
                                        <h6 className='my-0'>Date Last Updated</h6>
                                        <small className='text-muted'>{moment(asset.updated).format('MMMM Do YYYY, h:mm:ss a')}</small>
                                    </div>
                                </div>
                            :   null
                        }
                    </div>
                </div>


                <div className='form-floating mb-3'>
                    <button
                        className='w-100 btn btn-primary'
                        type='button'
                        onClick={ patch }>Save</button>
                </div>

                <div className='form-floating mb-3'>
                    <button
                        className='w-100 btn btn-secondary'
                        type='button'
                        onClick={ () => { navigate('/assets') } }>Close</button>
                </div>

            </form>
        </div>
    );
}

export default EditAssetForm;