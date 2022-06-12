import React from 'react';
import {Marker} from '@react-google-maps/api';

const CustomMarker = (props) => {
    const {id} = props;

    const onMarkerClick = (event) => {
        console.log(id);
    };

    return (
        <Marker
            onClick={onMarkerClick}
            {...props}
        />
    );
};

export default CustomMarker;