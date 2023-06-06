import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const Reallocation = (props) => {

    const { allocation, parent, toggle, save } = props;

    const { register, handleSubmit, getValues, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: {
            contained: parent == null ? true : false
        }
    });

    const [ contained, setContained ] = useState(parent == null ? true : false);

    const toggleContained = () => {
        setContained(prevState => !prevState);
    }

    const onSave = () => {
        const { assetRef } = getValues();
        let value = null;

        if(assetRef !== '')
            value = assetRef;

        save({ assetRef: value });
        toggle();
    }

    return (
        <div className='form-admin'>
            <h1 className='h3 mb-3 fw-normal text-start'>Asset Reallocation</h1>
            <form>

                <div className='alert alert-info' role='alert'>
                    Allocation means an asset is contained within a different asset or an asset is a top level asset and is not contained within any asset.
                </div>

                <div>
                    <ul className='list-group mb-3'>
                        { allocation
                            ?   <li className='list-group-item d-flex justify-content-between lh-sm'>
                                    <div className='text-start'>
                                        <p className='my-0'><small>Current Allocation</small></p>
                                        <small className='text-muted'>{ allocation }</small>
                                    </div>
                                </li>
                            :   null
                        }
                    </ul>
                </div>

                <h1 className='h3 mb-3 fw-normal text-start'>Reallocate</h1>
                <div className='form-floating'>
                    <div className='form-check form-switch primary text-start'>
                        <input 
                            className='form-check-input'
                            type='checkbox'
                            role='switch'
                            id='contained'
                            { ...register('contained', { onChange: toggleContained, required: false })}
                        />
                        <label className='form-check-label' htmlFor='contained'>Top Level Asset</label>
                    </div>
                </div>

                { !contained
                    ?   <div className='mt-3'>
                            <div className='alert alert-info' role='alert'>
                                The ID of the asset you are allocating to can be found on that asset's details page.
                            </div>
                            <div className='form-floating'>
                                <input type='number' className='form-control form-auth-ele-mid' id='assetRef' placeholder='Organisation abbreviation' autoComplete='off' required minLength={3} maxLength={4}
                                { ...register('assetRef', {
                                    required: 'You must specify an asset to allocate to'
                                }) }
                                />
                                <label htmlFor='abbreviation'>Allocating To</label>
                            </div>
                            { errors.assetRef && <p className='form-auth-error mt-1'>{errors.assetRef.message}</p> }
                        </div>
                        
                    : null
                }

                

                <div className='form-floating mb-3 mt-3'>
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

export default Reallocation;