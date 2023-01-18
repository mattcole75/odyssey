import React from 'react';
import { useForm } from 'react-hook-form';

const EmailEdit = (props) => {

    const { email, toggle, save } = props;
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onChange', defaultValues: { email: email } });

    const updateHandler = (data) => {
        save(data);
        toggle();
    };

    return (
        <li className='list-group-item d-flex justify-content-between lh-sm'>
            <div className='form-auth'>
                <form className='was-validated' onSubmit={ handleSubmit(updateHandler) }>
                    <div className='form-floating mb-3'>
                        <input type='email' className='form-control' id='email' placeholder='name@example.com' autoComplete='off' required pattern="[^@]+@[^@]+\.[a-zA-Z]{2,}"
                        { ...register('email', {
                            required: "You must specify an Email address",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid Email Address"
                            }
                        })}
                        />
                        <label htmlFor='email'>Email</label>
                        { errors.email && <p className='form-auth-error mt-1'>{errors.email.message}</p> }
                    </div>
                    <button className='btn btn-outline-danger w-49 me-1' type='button' onClick={ toggle }>Cancel</button>
                    <button className='btn btn-outline-success w-49' type='submit'>Save</button>
                </form>
            </div>
        </li>
    );
}

export default EmailEdit;