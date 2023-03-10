import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { assetGetAsset, assetPatchAsset, adminGetOrganisationList } from '../../../store/actions/index';

import { useForm } from 'react-hook-form';
// import assetRoles from '../../../../config/lists/assetRoles';
import moment from 'moment';

import Backdrop from '../../ui/backdrop/backdrop';
import Spinner from '../../ui/spinner/spinner';

import { capitalizeFirstLetter } from '../../../shared/utility';

const AssetForm = () => {

    const { id } = useParams();
    const dispatch = useDispatch();

    const { loading, error, asset } = useSelector(state => state.asset);
    const { idToken } = useSelector(state => state.auth);
    const { organisations } = useSelector(state => state.admin);

    const [ inuseStatus, setInuseStatus ] = useState(asset != null ? asset.inuse : true);

    const onGetAsset = useCallback((idToken, id, identifier) => dispatch(assetGetAsset(idToken, id, identifier)), [dispatch]);
    const onPatchAsset = useCallback((idToken, data, identifier) => dispatch(assetPatchAsset(idToken, data, identifier)), [dispatch]);
    const onGetOrganisations = useCallback((idToken, identifier) => dispatch(adminGetOrganisationList(idToken, identifier)), [dispatch]);

    const { register, reset, getValues, formState: { errors } } = useForm({ mode: 'onChange' });

    useEffect(() => {
        onGetOrganisations(idToken, 'GET_ORGS');
    }, [idToken, onGetOrganisations]);
    

    // load asset details on page refresh given an id
    useEffect(() => {
        if(id !== 'new') {
            onGetAsset(idToken, id, 'GET_ASSET');
        }
    }, [id, idToken, onGetAsset, onGetOrganisations]);

    // watch for a change to the asset pointer and reset the form.
    useEffect(() => {
        reset(asset);
    }, [asset, reset]);
    

    const save = useCallback(() => {  
        if(asset !== null) {
            const { ownedByRef, maintainedByRef, name, description, status, installedDate, commissionedDate, decommissionedDate, disposedDate } = getValues();
            onPatchAsset(idToken, { ...asset,
                id: id,
                ownedByRef: ownedByRef,
                maintainedByRef: maintainedByRef,
                name: name,
                description: description,
                status: status,
                installedDate: installedDate === '' ? null : installedDate,
                commissionedDate: commissionedDate === '' ? null : commissionedDate,
                decommissionedDate: decommissionedDate === '' ? null : decommissionedDate,
                disposedDate: disposedDate === '' ? null : disposedDate,
                inuse: inuseStatus === false ? false : true
             }, 'PATCH_ASSET'); // update
        }
        // else {
        //     save({ ...data }); // new
        // }
    }, [asset, getValues, id, idToken, inuseStatus, onPatchAsset]);

    
    const toggleInuseStatus = () => {
        setInuseStatus(prevState => !prevState);
    }

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    return (
        <div className='form-admin container'>
             <Backdrop show={loading} />
            {spinner}
            {error &&
                <div className='container alert alert-danger text-center' role='alert'>
                    {error}
                </div>
            }
            
            {/* heading */}

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
            
            <form>
                {/* asset details */}
                <div className='form-floating'>
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

                <div className='form-floating'>
                    <select className='form-select form-auth-ele-mid' id='ownedByRef' aria-label='Asset status'
                         { ...register('ownedByRef', { required: 'You must select an owner organisation' }) }
                    >
                        <option value=''>Select...</option>
                        {
                            organisations && organisations.map(item => {
                                if(item.assetRole === 'Owner')
                                    return (<option key={item._id} value={item._id}>{item.name}</option>)
                                else
                                    return null;
                            })
                        }
                        
                    </select>
                    <label htmlFor='ownedByRef'>Asset Owner</label>
                </div>

                <div className='form-floating'>
                    <select className='form-select form-auth-ele-mid' id='maintainedByRef' aria-label='Asset status'
                         { ...register('maintainedByRef', { required: 'You must select a maintainer organisation' }) }
                    >
                        <option value=''>Select...</option>
                        {
                            organisations && organisations.map(item => {
                                if(item.assetRole === 'Maintainer')
                                    return (<option key={item._id} value={item._id}>{item.name}</option>)
                                else
                                    return null;
                            })
                        }
                        
                    </select>
                    <label htmlFor='maintainedByRef'>Asset Maintainer</label>
                </div>

                <div className='form-floating'>
                    <input type='text' className='form-control form-auth-ele-bot' id='description' placeholder='Asset Description' autoComplete='off' required minLength={3} maxLength={256}
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


                {/* Asset Status */}
                <div className='text-start'>
                    <h1 className='h3 mb-3 fw-normal text-start'>Asset Status</h1>
                </div>

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
                    <input type='date' className='form-control form-auth-ele-mid' id='commissionedDate' placeholder='Commissioned Date'
                    { ...register('commissionedDate') }
                    />
                    <label htmlFor='commissionedDate'>Commissioned Date</label>
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
                { errors.name && <p className='form-auth-error mt-1'>{errors.name.message}</p> }
                { errors.abbreviation && <p className='form-auth-error mt-1'>{errors.abbreviation.message}</p> }
                { errors.assetRole && <p className='form-auth-error mt-1'>{errors.assetRole.message}</p> }

                <div className='d-flex gap-2 w-100 justify-content-between mt-3'>
                    <div className='text-start'>
                        <h1 className='h3 mb-3 fw-normal text-start'>Record Status</h1>
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

                <div>
                    <ul className='list-group mb-3'>
                        <li className='list-group-item d-flex justify-content-between lh-sm'>
                            <div className='form-check form-switch primary text-start'>
                                <input 
                                    className='form-check-input'
                                    type='checkbox'
                                    role='switch'
                                    id='inuse'
                                    { ...register('inuse', { onChange: toggleInuseStatus, required: false })}
                                />
                                <label className='form-check-label' htmlFor='inuse'>{inuseStatus ? 'Asset is enabled' : 'Asset is disabled'}</label>
                            </div>
                        </li>
                        { asset
                            ?   <li className='list-group-item d-flex justify-content-between lh-sm'>
                                    <div className='text-start'>
                                        <h6 className='my-0'>Date Created</h6>
                                        <small className='text-muted'>{moment(asset.created).format('MMMM Do YYYY, h:mm:ss a')}</small>
                                    </div>
                                </li>
                            :   null
                        }
                        { asset
                            ?   <li className='list-group-item d-flex justify-content-between lh-sm'>
                                    <div className='text-start'>
                                        <h6 className='my-0'>Date Last Updated</h6>
                                        <small className='text-muted'>{moment(asset.updated).format('MMMM Do YYYY, h:mm:ss a')}</small>
                                    </div>
                                </li>
                            :   null
                        }
                    </ul>
                </div>


                <div className='form-floating mb-3'>
                    <button
                        className='w-100 btn btn-primary'
                        type='button'
                        onClick={ save }>Save</button>
                </div>

                <div className='form-floating mb-3'>
                    <button
                        className='w-100 btn btn-secondary'
                        type='button'
                        onClick={ () => {} }>Close</button>
                </div>

            </form>
        </div>
    );
}

export default AssetForm;