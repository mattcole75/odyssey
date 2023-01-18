import React from 'react';
import { useForm } from 'react-hook-form';

const DisplayNameEdit = (props) => {

    const { displayName, toggle, save } = props;
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange', defaultValues: { displayName: displayName } });

    const updateHandler = (data) => {
        save(data);
        toggle();
    };

    return (
        <li className='list-group-item d-flex justify-content-between lh-sm'>
            <div className='form-auth'>
                <form className='was-validated' onSubmit={ handleSubmit(updateHandler) }>
                    <div className='form-floating mb-3'>
                        <input type='text' className='form-control' id='displayName' placeholder='Your name' autoComplete='off' required minLength={6} maxLength={32}
                        { ...register('displayName', {
                            required: "You must specify a Display Name",
                            minLength: {
                                value: 6,
                                message: "Display Name must have at least 6 characters"
                            },
                            maxLength: {
                                value: 32,
                                message: 'Display Name must have less than 32 characters'
                            }
                        }) }
                        />
                        <label htmlFor='displayName'>Display Name</label>
                        { errors.displayName && <p className='form-auth-error mt-1'>{errors.displayName.message}</p> }
                    </div>
                    <button className='btn btn-outline-danger w-49 me-1' type='button' onClick={ toggle }>Cancel</button>
                    <button className='btn btn-outline-success w-49' type='submit'>Save</button>
                </form>
            </div>
        </li>
    );
}

export default DisplayNameEdit;