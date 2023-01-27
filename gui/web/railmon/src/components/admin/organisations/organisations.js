import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminUpdateOganisation } from '../../../store/actions/index';
import Search from './search/search';
import Organisations from './list/organisationList';
import Backdrop from '../../ui/backdrop/backdrop';
import Modal from '../../ui/modal/modal';
import Spinner from '../../ui/spinner/spinner';
import OrgForm from './orgForm/orgForm';

const organisations = React.memo(() => {

    const dispatch = useDispatch();

    const [ organisation, setOrganisation ] = useState(null);

    const { idToken } = useSelector(state => state.auth);
    const { loading, error, organisations } = useSelector(state => state.admin);

    const [editingOrg, setEditingOrg] = useState(false);

    // editing toggles
    const toggleOrgEditing = (org) => {
        setOrganisation(org);
        setEditingOrg(prevState => !prevState);
    };

    const onSave = useCallback((idToken, data, identifier) => {
        dispatch(adminUpdateOganisation(idToken, data, identifier))
    }, [dispatch]);

    const saveHandler = useCallback((data) => {
        onSave(idToken, data, 'ADMIN_UPDATE');
    }, [idToken, onSave]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    // modal edit user
    let modal = null;
    if(editingOrg) {
        modal = <Modal
            show={editingOrg}
            modalClosed={toggleOrgEditing}
            content={
                <OrgForm
                    toggle={toggleOrgEditing}
                    save={saveHandler}
                    organisation={organisation}
                />
            } />;
    }
    
    return (

        <section>
            <Backdrop show={loading} />
            {spinner}
            {error &&
                <div className='container alert alert-danger text-center' role='alert'>
                    {error}
                </div>
            }
            {modal}
            <div className='u-margin-bottom-small'>
                <Search />
            </div>

            <div>
                <Organisations organisations={organisations} toggle={toggleOrgEditing} />
            </div>

        </section>
    )

});

export default organisations;