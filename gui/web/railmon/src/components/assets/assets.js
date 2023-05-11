import React from 'react';
import { useSelector } from 'react-redux';
import Search from './search/search';
import Assets from './list/assetList';
import Backdrop from '../ui/backdrop/backdrop';
import Spinner from '../ui/spinner/spinner';

const assets = React.memo(() => {

    // const dispatch = useDispatch();
    // const [ user, setUser ] = useState(null);
    // const { idToken, localId } = useSelector(state => state.auth);
    const { loading, error, assets } = useSelector(state => state.asset);

    // const [editingUser, setEditingUser] = useState(false);

    // editing toggles
    // const toggleUserEditing = (user) => {
    //     setUser(user);
    //     setEditingUser(prevState => !prevState);
    // };

    // const onSave = useCallback((idToken, localId, data, identifier) => {
    //     dispatch(adminUpdateUser(idToken, localId, data, identifier))
    // }, [dispatch]);

    // const saveHandler = useCallback((data) => {
    //     onSave(idToken, localId, data, 'ADMIN_UPDATE');
    // }, [idToken, localId, onSave]);

    let spinner = null;
    if(loading)
        spinner = <Spinner />;

    
    return (
        <section>
            <Backdrop show={loading} />
            {spinner}
            {error &&
                <div className='container alert alert-danger text-center' role='alert'>
                    {error}
                </div>
            }
            
            <div className='u-margin-bottom-small'>
                <Search />
            </div>

            <div>
                <Assets assets={assets}  />
            </div>
        </section>
    )

});

export default assets;