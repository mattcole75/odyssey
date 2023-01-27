import React, { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { adminGetOrganisations } from '../../../../store/actions/index'


const Search = React.memo(() => {

    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    const dispatch = useDispatch();

    const { idToken, localId } = useSelector(state => state.auth);

    const onLoadOrgs = useCallback((idToken, query, identifier) => {
        dispatch(adminGetOrganisations(idToken, query, identifier))
    },[dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
          if(enteredFilter === inputRef.current.value) {
            const query =
                enteredFilter.length === 0
                ? ''
                : enteredFilter;
            onLoadOrgs(idToken, query, 'GET_ORGS')
          }
        }, 500);
        return () => {
          clearTimeout(timer);
        };
    }, [enteredFilter, inputRef, onLoadOrgs, idToken, localId]);

    return (
        <div className='container d-flex flex-wrap justify-content-center mt-3'>

            <div className='d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none'>
                <h1 className="heading-primary">
                    <span className='heading-primary_main'>Organisations</span>
                </h1>
            </div>
            
            <form className='col-12 col-lg-auto mb-3 mb-lg-0'>
                <input
                    type="search"
                    className='form-control'
                    ref={inputRef}
                    placeholder='Search Org...'
                    aria-label='Search'
                    value={enteredFilter}
                    onChange={event => setEnteredFilter(event.target.value)}
                />
            </form>
        </div>
    );
});

export default Search;