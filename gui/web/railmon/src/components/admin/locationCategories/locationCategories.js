import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminUpdateLocationCategory, adminCreateLocationCategory } from '../../../store/actions/index';
import Search from './search/search';
import LocationCategories from './list/locationCategoryList';
import Backdrop from '../../ui/backdrop/backdrop';
import Modal from '../../ui/modal/modal';
import Spinner from '../../ui/spinner/spinner';
import LocationCategoryForm from './locationCategoryForm/locationCategoryForm';

const locationCategories = React.memo(() => {

    const dispatch = useDispatch();

    const [ locationCategory, setLocationCategory ] = useState(null);

    const { idToken } = useSelector(state => state.auth);
    const { loading, error, locationCategories } = useSelector(state => state.admin);

    const [editingLocationCategory, setEditingLocationCategory] = useState(false);

    // editing toggles
    const toggleLocationCategoryEditing = (locationCategory) => {
        setLocationCategory(locationCategory);
        setEditingLocationCategory(prevState => !prevState);
    };

    const newLocationCategoryHandler = () => {
        toggleLocationCategoryEditing(null);
    }

    const onUpdate = useCallback((idToken, data, identifier) => {
        dispatch(adminUpdateLocationCategory(idToken, data, identifier))
    }, [dispatch]);

    const onCreate = useCallback((idToken, data, identifier) => {
        dispatch(adminCreateLocationCategory(idToken, data, identifier))
    }, [dispatch]);

    const saveHandler = useCallback((data) => {
        if(data.uid != null)
            onUpdate(idToken, data, 'LOCATION_CATEGORY_UPDATE');
        else
            onCreate(idToken, data, "LOCATION_CATEGORY_CREATE")
    }, [idToken, onUpdate, onCreate]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    // modal edit user
    let modal = null;
    if(editingLocationCategory) {
        modal = <Modal
            show={ editingLocationCategory }
            modalClosed={ toggleLocationCategoryEditing }
            content={
                <LocationCategoryForm
                    toggle={ toggleLocationCategoryEditing }
                    save={ saveHandler }
                    locationCategory={ locationCategory }
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
                <Search newLocationCategoryHandler={ newLocationCategoryHandler } />
            </div>

            <div>
                <LocationCategories locationCategories={ locationCategories } toggle={ toggleLocationCategoryEditing } />
            </div>

        </section>
    )

});

export default locationCategories;