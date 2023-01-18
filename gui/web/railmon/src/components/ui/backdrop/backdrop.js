import React from 'react';

const backdrop = (props) => (
    props.show
        ? <div className="modal-backdrop" onClick={props.clicked}></div>
        : null
);

export default backdrop;