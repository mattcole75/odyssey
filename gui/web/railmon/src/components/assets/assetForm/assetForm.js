import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

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
                <div className='row g-2 mb-2'>
                    <div className='col-sm-6'>
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
                            <input type='text' className='form-control form-auth-ele-bot' id='assetRef' placeholder='Asset Reference' autoComplete='off' readOnly value={ asset && asset.assetRef ? asset.assetRef : 'Top Level Asset' } />
                            <label htmlFor='assetRef'>Parent Asset</label>
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
                                            return (<option key={item._id} value={item._id}>{item.name}</option>)
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
                                            return (<option key={item._id} value={item._id}>{item.name}</option>)
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
                

                <div className='row g-2 mb-2'>
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
                                { ...register('inuse', { onChange: toggleInuseStatus, required: true })}
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

                <div className='text-start'>
                    <h1 className='h3 mb-3 fw-normal text-start'>Record Details</h1>
                </div>

                <div className='row g-2 mb-4'>
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
                        onClick={ save }>Save</button>
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

export default AssetForm;