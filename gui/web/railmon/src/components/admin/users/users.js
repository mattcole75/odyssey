import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminUpdateUser } from '../../../store/actions/index';
import Search from './search/search';
import Users from './list/userList';
import Backdrop from '../../ui/backdrop/backdrop';
import Modal from '../../ui/modal/modal';
import Spinner from '../../ui/spinner/spinner';
import AdminForm from './adminForm/adminForm';

const user = React.memo(() => {

    const dispatch = useDispatch();

    const [ user, setUser ] = useState(null);

    const { idToken, localId } = useSelector(state => state.auth);
    const { loading, error, users } = useSelector(state => state.admin);

    const [editingUser, setEditingUser] = useState(false);

    // editing toggles
    const toggleUserEditing = (user) => {
        setUser(user);
        setEditingUser(prevState => !prevState);
    };

    const onSave = useCallback((idToken, localId, data, identifier) => {
        dispatch(adminUpdateUser(idToken, localId, data, identifier))
    }, [dispatch]);

    const saveHandler = useCallback((data) => {
        onSave(idToken, localId, data, 'ADMIN_UPDATE');
    }, [idToken, localId, onSave]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    // modal edit user
    let modal = null;
    if(editingUser) {
        modal = <Modal
            show={editingUser}
            modalClosed={toggleUserEditing}
            content={
                <AdminForm
                    toggle={toggleUserEditing}
                    save={saveHandler}
                    user={user}
                />
            } />;
    }
    
    return (

        <section>
            <Backdrop show={loading} />
            {spinner}
            {error &&
                <div className='alert alert-danger' role='alert'>
                    {error}
                </div>
            }
            {modal}
            <div className='u-margin-bottom-small'>
                <Search />
            </div>

            <div>
                <Users users={users} toggle={toggleUserEditing} />
            </div>

        </section>
    )

});

export default user;