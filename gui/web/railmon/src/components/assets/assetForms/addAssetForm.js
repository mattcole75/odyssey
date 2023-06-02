import React from 'react';

import { useForm } from 'react-hook-form';

const AddAssetForm = (props) => {

    const { toggle, save, containerId, containerName } = props;

    const { register, getValues, formState: { errors } } = useForm({ mode: 'onChange' });

    const saveHandler = () => {
        const { name, description } = getValues();

        save({
            assetRef: containerId,
            name: name,
            description: description
        });
    }

    return (
        <div className='form-admin'>
            <h1 className='h3 mb-3 fw-normal text-start'>New Asset</h1>
            { containerId == null
                ?   <div className='alert alert-primary' role='alert'>
                        Top level asset
                    </div>
                :   <div className='alert alert-primary' role='alert'>
                        { `Contained within the ${ containerName }` }
                    </div>
            }
            

            <form>
            <div className='form-floating'>
                    <input type='text' className='form-control form-auth-ele-top' id='name' placeholder='Organisation name' autoComplete='off' required minLength={3} maxLength={50}
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
                    <textarea className='form-control form-auth-ele-bot' id='description' placeholder='Asset Description' rows='3' required minLength={3} maxLength={256}  style={{height:'auto'}}
                        { ...register('description', {
                            required: 'You must provide a Asset description',
                            minLength: {
                                value: 3,
                                message: 'Asset description must have at least 3 characters'
                            },
                            maxLength: {
                                value: 256,
                                message: 'Location category description cannot have more than 256 characters'
                            }
                        }) }
                    />
                    <label htmlFor='description'>Asset Description</label>
                </div>
                { errors.name && <p className='form-auth-error mt-1'>{errors.name.message}</p> }
                { errors.description && <p className='form-auth-error mt-1'>{errors.description.message}</p> }
                
                <div className='form-floating mb-3'>
                    <button
                        className='w-100 btn btn-primary'
                        type='button'
                        onClick={ saveHandler }>Save</button>
                </div>

                <div className='form-floating'>
                    <button
                        className='w-100 btn btn-secondary'
                        type='button'
                        onClick={ toggle }>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddAssetForm;