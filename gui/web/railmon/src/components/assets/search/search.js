import React, { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { assetGetAssets } from '../../../store/actions/index';


const Search = React.memo((props) => {

    const { newAssetHandler } = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    const dispatch = useDispatch();

    const { idToken } = useSelector(state => state.auth);

    const onLoadAssets = useCallback((idToken, query, identifier) => {
        dispatch(assetGetAssets(idToken, query, identifier))
    },[dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
          if(enteredFilter === inputRef.current.value) {
            const query =
                enteredFilter.length === 0
                ? ''
                : enteredFilter;
                onLoadAssets(idToken, query, 'GET_ASSETS')
          }
        }, 500);
        return () => {
          clearTimeout(timer);
        };
    }, [enteredFilter, inputRef, onLoadAssets, idToken]);

    return (
        <div className='container d-flex flex-wrap justify-content-center mt-3'>

            <div className='d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none'>
                <h1 className="heading-primary">
                    <span className='heading-primary_main'>Asset Register</span>
                </h1>
            </div>

            <div className='d-flex align-items-center col-lg-auto mb-3 mb-lg-0 ms-3 me-3'>
                <button className='btn btn-outline-primary' onClick={ newAssetHandler }>Add Asset</button>
            </div>
            
            <form className='d-flex col-12 align-items-center col-lg-auto mb-3 mb-lg-0'>
                <input
                    type="search"
                    className='form-control'
                    ref={inputRef}
                    placeholder='Search...'
                    aria-label='Search'
                    value={enteredFilter}
                    onChange={event => setEnteredFilter(event.target.value)}
                />
            </form>
        </div>
    );
});

export default Search;