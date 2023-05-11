import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import moment from 'moment';

const LocationCategoryForm = (props) => {

    const { locationCategory, save, toggle } = props;

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { 
            name: locationCategory && locationCategory.name,
            description: locationCategory && locationCategory.description,
            inuse: locationCategory ? locationCategory.inuse : true
        }
    });

    const [ status, setStatus ] = useState(locationCategory != null ? locationCategory.inuse : true);

    const onSave = useCallback((data) => {
        if(locationCategory !== null) {
            save({ ...data, id: locationCategory.id }); // update
        } else {
            save({ ...data }); // new
        }
        toggle();
    }, [locationCategory, save, toggle]);

    const toggleStatus = () => {
        setStatus(prevState => !prevState);
    }

    return (
        <div className='form-admin'>
            <h1 className='h3 mb-3 fw-normal text-start'>Details</h1>
            
            
            <form>

                <div className='form-floating'>
                    <input type='text' className='form-control form-auth-ele-top' id='name' placeholder='Location Category' autoComplete='off' required minLength={3} maxLength={50}
                    { ...register('name', {
                        required: 'You must specify a location category',
                        minLength: {
                            value: 3,
                            message: 'Location category must have at least 3 characters'
                        },
                        maxLength: {
                            value: 50,
                            message: 'Location category must have less than 50 characters'
                        }
                    }) }
                    />
                    <label htmlFor='name'>Location Category</label>
                </div>

                <div className='form-floating'>
                    <textarea className='form-control' id='description' placeholder='Asset Description' rows='3' required minLength={3} maxLength={256}  style={{height:'auto'}}
                        { ...register('description', {
                            required: 'You must provide a location category description',
                            minLength: {
                                value: 3,
                                message: 'Location category description must have at least 3 characters'
                            },
                            maxLength: {
                                value: 256,
                                message: 'Location category description cannot have more than 256 characters'
                            }
                        }) }
                    />
                    <label htmlFor='description'>Location Category Description</label>
                </div>
                { errors.name && <p className='form-auth-error mt-1'>{errors.name.message}</p> }
                { errors.description && <p className='form-auth-error mt-1'>{errors.description.message}</p> }

                <div className="d-flex gap-2 w-100 justify-content-between mt-3">
                        <div className='text-start'>
                            <h1 className='h3 mb-3 fw-normal text-start'>Status</h1>
                        </div>
                        { locationCategory
                            ?   <small className="opacity-75 text-nowrap">
                                    { locationCategory.inuse 
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
                        { locationCategory
                            ?   <li className='list-group-item d-flex justify-content-between lh-sm'>
                                    <div className='text-start'>
                                        <h6 className='my-0'>Date Created</h6>
                                        <small className='text-muted'>{moment(locationCategory.created).format('MMMM Do YYYY, h:mm:ss a')}</small>
                                    </div>
                                </li>
                            :   null
                        }
                        { locationCategory
                            ?   <li className='list-group-item d-flex justify-content-between lh-sm'>
                                    <div className='text-start'>
                                        <h6 className='my-0'>Date Last Updated</h6>
                                        <small className='text-muted'>{moment(locationCategory.updated).format('MMMM Do YYYY, h:mm:ss a')}</small>
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

export default LocationCategoryForm;