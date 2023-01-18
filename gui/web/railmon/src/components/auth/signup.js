import React, { useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { hashPassword } from '../../shared/utility';
import { signup } from '../../store/actions/index';

import Backdrop from '../ui/backdrop/backdrop';
import Spinner from '../ui/spinner/spinner';

const Signup = () => {

    const dispatch = useDispatch();

    const { idToken, loading, error, redirectPath } = useSelector(state => state.auth);
    const isAuthenticated = idToken !== null;

    const onSignup = useCallback((authData, identifier) => dispatch(signup(authData, identifier)), [dispatch]);
    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm({ mode: 'onChange' });
    
    const inputRef = useRef({});
    inputRef.current = watch('password');

    const signupHandler = useCallback((data) => {
        const hash = async () => {
            await hashPassword(getValues().password)
                .then(value => {
                    onSignup({
                        displayName: data.displayName,
                        email: data.email,
                        password: value
                    }, 'SIGNUP');
                })
            }
            hash();
    }, [getValues, onSignup]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />
    
    return (
        <form className='form-auth' onSubmit={ handleSubmit(signupHandler) }>
            { isAuthenticated ? <Navigate to={ redirectPath } /> : null }
            <Backdrop show={ loading } />
            { spinner }
            { error &&
                <div className='alert alert-danger' role='alert'>
                    { error }
                </div>
            }
            <div className='text-center'>
                <i className='bi-person-plus form-auth-icon'></i>
                <h1 className='h3 mb-3 fw-normal'>Sign-Up</h1>
            </div>

            <div className='form-floating'>
                <input type='text' className='form-control form-auth-ele-top' id='displayName' placeholder='Your name' autoComplete='off' required minLength={6} maxLength={32}
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
            </div>

            <div className='form-floating'>
                <input type='email' className='form-control form-auth-ele-mid' id='email' placeholder='name@example.com' autoComplete='off' required pattern="[^@]+@[^@]+\.[a-zA-Z]{2,}"
                { ...register('email', {
                    required: "You must specify an Email address",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid Email Address"
                    }
                })}
                />
                <label htmlFor='email'>Email Address</label>
            </div>
            <div className='form-floating'>
                <input type='text' className='form-control form-auth-password form-auth-ele-mid' id='password' placeholder='Password' autoComplete='off' required pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$" ref={ inputRef }
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
                <input type='text' className='form-control form-auth-password form-auth-ele-bot' id='passwordConfirm' placeholder='Password' autoComplete='off' validate={false}
                { ...register('passwordRepeat', {
                    validate: value =>
                      value === inputRef.current || "The passwords do not match"
                }) }
                />
                <label htmlFor='passwordConfirm'>Confirm Password</label>
            </div>
            { errors.displayName && <p className='form-auth-error mt-1'>{errors.displayName.message}</p> }
            { errors.email && <p className='form-auth-error mt-1'>{errors.email.message}</p> }
            { errors.passwordRepeat && <p className='form-auth-error mt-1'>{errors.passwordRepeat.message}</p> }
            { errors.password && <p className='form-auth-error '>{errors.password.message}</p> }

            <button className='w-100 btn btn-lg btn-primary' type='submit'>Sign-Up</button>
        </form>
    );
}

export default Signup;