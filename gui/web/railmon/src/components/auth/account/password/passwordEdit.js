import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

const PasswordEdit = (props) => {

    const { toggle, save } = props;
    const { register, handleSubmit, watch, formState: { errors } } = useForm({});
    const inputRef = useRef({});
    inputRef.current = watch('password');

    const updateHandler = (data) => {
        save(data);
        toggle();
    };

    return (
        <li className='list-group-item d-flex justify-content-between lh-sm'>
            <div className=''>
                <form className='form-auth' onSubmit={ handleSubmit(updateHandler) }>
                    <div className='form-floating'>
                        <input 
                            type='text'
                            className='form-control form-auth-ele-top form-auth-password'
                            id='password'
                            name='password'
                            placeholder='Your password'
                            autoComplete='off'
                            required
                            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                            ref={ inputRef }
                            { ...register('password', {
                                required: "You must specify a password",
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i,
                                    message: "Minimum eight characters, at least one letter, one number and one special character"
                                }
                              }) }
                        />
                        <label htmlFor='password'>Password</label>
                        
                    </div>
                    <div className='form-floating mb-3'>
                        <input 
                            type='text'
                            className='form-control form-auth-ele-bot form-auth-password'
                            id='passwordRepeat'
                            name='passwordRepeat'
                            placeholder='Confirmed password'
                            autoComplete='off'
                            { ...register('passwordRepeat', {
                                validate: value =>
                                  value === inputRef.current || "The passwords do not match"
                            }) }
                        />
                        <label htmlFor='passwordRepeat'>Password Confirmation</label>
                        { errors.passwordRepeat && <p className='form-auth-error mt-1'>{errors.passwordRepeat.message}</p> }
                        { errors.password && <p className='form-auth-error '>{errors.password.message}</p> }
                    </div>
                    <button className='btn btn-outline-danger w-49 me-1' type='button' onClick={ toggle }>Cancel</button>
                    <button className='btn btn-outline-success w-49' type='submit'>Save</button>
                </form>
            </div>
        </li>
    );
}

export default PasswordEdit;