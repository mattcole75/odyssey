import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDisplayName, updateEmail, updatePassword } from '../../../store/actions/index';
import { hashPassword } from '../../../shared/utility';

import DisplayNameEdit from './displayName/displayNameEdit';
import DisplayNameView from './displayName/displayNameView';
import EmailEdit from './email/emailEdit';
import EmailView from './email/emailView';
import PasswordEdit from './password/passwordEdit';
import PasswordView from './password/passwordView';

const Account = () => {

    // connect to redux a extract values
    const dispatch = useDispatch();
    const { loading, error, idToken, localId, displayName, email, roles } = useSelector(state => state.auth);
    // declare the redux functions
    const onDisplayNameUpdate = useCallback((authData, identifier) => dispatch(updateDisplayName(authData, idToken, localId, identifier)), [dispatch, idToken, localId]);
    const onEmailUpdate = useCallback((authData, identifier) => dispatch(updateEmail(authData, idToken, localId, identifier)), [dispatch, idToken, localId]);
    const onPasswordUpdate = useCallback((authData, identifier) => dispatch(updatePassword(authData, idToken, localId, identifier)), [dispatch, idToken, localId]);
    // declare the state object for the interface toggles
    const [editingDisplayName, setEditingDisplayName] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    // declare the edit toggle functions
    const toggleEditingDisplayName = () => { setEditingDisplayName(prevState => !prevState); }
    const toggleEditingEmail = () => { setEditingEmail(prevState => !prevState); }
    const toggleEditingPassword = () => { setEditingPassword(prevState => !prevState); }
    // update handlers
    const displayUpdateNameHandler = useCallback((data) => {
        onDisplayNameUpdate(data, 'UPDATE_DISPLAY_NAME');
    },[onDisplayNameUpdate]);
    const emailUpdateHandler = useCallback((data) => {
        onEmailUpdate(data, 'UPDATE_EMAIL');
    }, [onEmailUpdate]);
    const passwordUpdateHandler = useCallback((data) => {
        const hash = async () => {
            await hashPassword(data.password)
                .then(value => {
                    onPasswordUpdate(value, 'UPDATE_PASSWORD');
                })
        }
        hash();
    }, [onPasswordUpdate]);

    return (
        <div className='form-auth'>
            { error &&
                <div className='alert alert-danger' role='alert'>
                    { error }
                </div>
            }
            <div className='text-center'>
                <i className='bi-person-bounding-box form-auth-icon'></i>
                <h1 className='h3 mb-3 fw-normal'>Your Account Details</h1>
            </div>
            <ul className='list-group'>

                { editingDisplayName
                    ?   <DisplayNameEdit toggle={ toggleEditingDisplayName } displayName={ displayName } save={ displayUpdateNameHandler } />
                    :   <DisplayNameView toggle={ toggleEditingDisplayName } displayName={ displayName } />
                }
                { editingEmail
                    ?   <EmailEdit toggle={ toggleEditingEmail } email={ email } save={ emailUpdateHandler } />
                    :   <EmailView toggle={ toggleEditingEmail } email={ email } />
                }
                { editingPassword
                    ? <PasswordEdit toggle={ toggleEditingPassword } save={ passwordUpdateHandler } />
                    : <PasswordView toggle={ toggleEditingPassword } />
                }

                <li className='list-group-item d-flex justify-content-between lh-sm'>
                    <div className='text-start'>
                        <h6 className='my-0'>Roles</h6>
                        <small className='text-muted'>{ Array.isArray(roles) ? roles.join(', ') : null }</small>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default Account;