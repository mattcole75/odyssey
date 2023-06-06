import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import assetRoles from '../../../../config/lists/assetRoles';
import moment from 'moment';

const OrgForm = (props) => {

    const { organisation, save, toggle } = props;

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { 
            name: organisation && organisation.name,
            abbreviation: organisation && organisation.abbreviation,
            assetRole: organisation && organisation.assetRole,
            inuse: organisation ? organisation.inuse : true
        }
    });

    const [ status, setStatus ] = useState(organisation != null ? organisation.inuse : true);

    const onSave = useCallback((data) => {
        if(organisation !== null) {
            save({ ...data, id: organisation.id }); // update
        } else {
            save({ ...data }); // new
        }
        toggle();
    }, [organisation, save, toggle]);

    const toggleStatus = () => {
        setStatus(prevState => !prevState);
    }

    return (
        <div className='form-admin'>
            <h1 className='h3 mb-3 fw-normal text-start'>Details</h1>
            
            
            <form>

                <div className='form-floating'>
                    <input type='text' className='form-control form-auth-ele-top' id='name' placeholder='Organisation name' autoComplete='off' required minLength={3} maxLength={50}
                    { ...register('name', {
                        required: 'You must specify an Organisation Name',
                        minLength: {
                            value: 3,
                            message: 'Organisation Name must have at least 3 characters'
                        },
                        maxLength: {
                            value: 50,
                            message: 'Organisation Name must have less than 50 characters'
                        }
                    }) }
                    />
                    <label htmlFor='name'>Organisation Name</label>
                </div>

                <div className='form-floating'>
                    <input type='text' className='form-control form-auth-ele-mid' id='abbreviation' placeholder='Organisation abbreviation' autoComplete='off' required minLength={3} maxLength={4}
                    { ...register('abbreviation', {
                        required: 'You must specify an Organisation Abbreviation',
                        minLength: {
                            value: 3,
                            message: 'Organisation Abbreviation must have at least 3 characters'
                        },
                        maxLength: {
                            value: 4,
                            message: 'Organisation Abbreviation cannot have more than 4 characters'
                        }
                    }) }
                    />
                    <label htmlFor='abbreviation'>Organisation Abbreviation</label>
                </div>

                <div className='form-floating'>
                    <select className='form-select form-auth-ele-bot' id='assetRole' aria-label='Default select example'
                         { ...register('assetRole', { required: 'You must select a role' }) }
                    >
                        <option key={0} value=''>Select...</option>
                        {
                            assetRoles.map((item, index) => {
                                return (<option key={index} value={item.key}>{item.value}</option>)
                            })
                        }
                    </select>
                    <label htmlFor='assetRole'>Organisation Role</label>
                </div>
                { errors.name && <p className='form-auth-error mt-1'>{errors.name.message}</p> }
                { errors.abbreviation && <p className='form-auth-error mt-1'>{errors.abbreviation.message}</p> }
                { errors.assetRole && <p className='form-auth-error mt-1'>{errors.assetRole.message}</p> }

                <div className="d-flex gap-2 w-100 justify-content-between mt-3">
                        <div className='text-start'>
                            <h1 className='h3 mb-3 fw-normal text-start'>Status</h1>
                        </div>
                        { organisation
                            ?   <small className="opacity-75 text-nowrap">
                                    { organisation.inuse 
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
                            <div className="form-check form-switch primary text-start">
                                <input 
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="inuse"
                                    { ...register('inuse', { onChange: toggleStatus, required: false })}
                                />
                                <label className="form-check-label" htmlFor="inuse">{status ? 'Disable' : 'Enable'}</label>
                            </div>
                        </li>
                        { organisation
                            ?   <li className='list-group-item d-flex justify-content-between lh-sm'>
                                    <div className='text-start'>
                                        <p className='my-0'><small>Date Created</small></p>
                                        <small className='text-muted'>{moment(organisation.created).format('MMMM Do YYYY, h:mm:ss a')}</small>
                                    </div>
                                </li>
                            :   null
                        }
                        { organisation
                            ?   <li className='list-group-item d-flex justify-content-between lh-sm'>
                                    <div className='text-start'>
                                        <p className='my-0'><small>Date Last Updated</small></p>
                                        <small className='text-muted'>{moment(organisation.updated).format('MMMM Do YYYY, h:mm:ss a')}</small>
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
                        onClick={ handleSubmit(onSave) }>Save</button>
                </div>

                <div className='form-floating mb-3'>
                    <button
                        className='w-100 btn btn-secondary'
                        type='button'
                        onClick={ toggle }>Close</button>
                </div>

            </form>
        </div>
    );
}

export default OrgForm;