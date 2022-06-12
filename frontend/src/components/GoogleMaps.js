import { GoogleMap, useLoadScript, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import React from "react";
import { useState } from "react";


const libraries = ["places"] //Moved it outside to avoid to many renders
const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
}
const center = {lat: 57.72101, lng: 12.9401 }
const options = {
    styles: mapStyles,
    disableDefaultUI: true, //Disable all of the controlls
    zoomControl: true,  
}

export default function GoogleMaps() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    })
    const [markers, setMarkers] = useState([])

    if (!isLoaded) return <div>Loading...</div>;
    return <GoogleMap //Google maps package
    mapContainerStyle={mapContainerStyle}
    zoom={10}
    center={center}
    options={options}
    onClick={(event) => {
        setMarkers(current => [...current, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date (),
        }])
    }}
    >
        {markers.map(marker => <Marker 
            key={marker.time.toISOString()} 
            position={{lat: marker.lat, lng: marker.lng}} />)}

    </GoogleMap> 
}



