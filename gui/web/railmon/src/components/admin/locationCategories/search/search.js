import React, { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { adminGetLocationCategories } from '../../../../store/actions/index'


const Search = React.memo((props) => {

    const { newLocationCategoryHandler } = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    const dispatch = useDispatch();

    const { idToken, localId } = useSelector(state => state.auth);

    const onLoadLocationCategories = useCallback((idToken, query, identifier) => {
        dispatch(adminGetLocationCategories(idToken, query, identifier))
    },[dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
          if(enteredFilter === inputRef.current.value) {
            const query =
                enteredFilter.length === 0
                ? ''
                : enteredFilter;
                onLoadLocationCategories(idToken, query, 'GET_LOCATION_CATEGORIES')
          }
        }, 500);
        return () => {
          clearTimeout(timer);
        };
    }, [enteredFilter, inputRef, idToken, localId, onLoadLocationCategories]);

    return (
        <div className='container d-flex flex-wrap justify-content-center mt-3'>

            <div className='d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none'>
                <h1 className="heading-primary">
                    <span className='heading-primary_main'>Location Categories</span>
                </h1>
            </div>

            <div className='d-flex align-items-center col-lg-auto mb-3 mb-lg-0 ms-3 me-3'>
                <button className='btn btn-outline-primary' onClick={ newLocationCategoryHandler }>Add</button>
            </div>
            
            <form className='d-flex col-12 align-items-center col-lg-auto mb-3 mb-lg-0'>
                <input
                    type="search"
                    className='form-control'
                    ref={inputRef}
                    placeholder='Search Location Categories...'
                    aria-label='Search'
                    value={enteredFilter}
                    onChange={event => setEnteredFilter(event.target.value)}
                />
            </form>
        </div>
    );
});

export default Search;