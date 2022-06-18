import { GoogleMap, useLoadScript, Marker, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import React, { useCallback } from "react";
import { useState, useRef } from "react";
import { formatRelative } from 'date-fns'
import Combobox from "react-widgets/Combobox"
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
}  from "use-places-autocomplete";
import { geocodeByAddress } from "react-places-autocomplete";
import PlacesAutocomplete from "react-places-autocomplete";


const libraries = ["places"] //Moved it outside to avoid to many renders
const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
}
const center = {lat: 57.72101, lng: 12.9401}
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
    const [selected, setSelected] = useState(null)

    const onMapClick = useCallback((event) => {
        setMarkers(current => [...current, {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
            time: new Date (),
        }])
    }, [])

    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, [])

    const panTo = useCallback(({lat, lng}) => {
        mapRef.current.panTo({lat, lng})
        mapRef.current.setZoom(14)
    }, [])

    if (!isLoaded) return <div>Loading...</div>;
    return (

        <>
          <Search panTo={panTo} /> 

    <GoogleMap //Google maps package
    mapContainerStyle={mapContainerStyle}
    zoom={10}
    center={center}
    options={options}
    onClick={onMapClick}
    onLoad={onMapLoad}
    >
        {markers.map(marker => 
        <Marker 
            key={marker.time.toISOString()} 
            position={{lat: marker.lat, lng: marker.lng}}
            onClick={() => {
                setSelected(marker)
            }} 
            />
            )}
            {selected ? (
                <InfoWindow 
                position={{ lat: selected.lat, lng: selected.lng }} 
                onCloseClick={() =>{
                    setSelected(null)
                    }}
                    >
                    <div>
                        <h2>Hidden gem!</h2>
                        <p>Created at {formatRelative(selected.time, new Date())}</p>
                    </div>
                </InfoWindow>
                ) : null}
    </GoogleMap>
    </>
    ) 
}

function Search ({ panTo }) {

    const [address,setAddress] = useState("")
    const [coordinates,setCoordinates] = useState({
        lat:null,
        lng:null
    })

    const handleSelect = async value => {
        const results = await geocodeByAddress(value)
        const {lat ,lng} = await getLatLng(results[0])
        panTo({lat, lng})
        setAddress(value)
        setCoordinates(lat, lng)
    }

    return (
        <div className="search">
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                    key={suggestion.placeId}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
          )}
        </PlacesAutocomplete>
        </div>
      );
    
}








