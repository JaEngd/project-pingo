import { GoogleMap, useLoadScript, Marker, useJsApiLoader, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import React, { useCallback, useEffect } from "react";
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
const center = {lat: 57.72101, lng: 12.9401} //options for the google maps component. To avoid re rendering.
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
    const [pins, setPins] = useState([])
    const [selected, setSelected] = useState(null)
    const [desc, setDesc] = useState(null)
    const [newPlace, setNewPlace] = useState(null)
    const [title, setTitle] = useState(null)
    const currentUser = "Jacob"

    const onMapClick = useCallback((event) => { //setMarkers functon
        setMarkers(current => [...current, { //Recieve the current state and returning a new version of it
            lat: event.latLng.lat(), //adding a new marker
            lng: event.latLng.lng(),
            time: new Date (), //time format
        }])
    }, [])

    const mapRef = useRef(); //to pan and zoom
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []) 

    const panTo = useCallback(({lat, lng}) => { //use callback to avoid render triggering
        mapRef.current.panTo({lat, lng})
        mapRef.current.setZoom(14)
    }, [])

    if (!isLoaded) return <div>Loading...</div>;
    return (  

      <div>
        <>
          <Search panTo={panTo} /> 
          <Locate panTo={panTo} />
            <h1>PinGo{" "} <img className="map-marker" src="map-marker.png" alt="" /></h1>
    
    <GoogleMap //Google maps package
    mapContainerStyle={mapContainerStyle}
    zoom={10}
    center={center}   
    options={options}
    onClick={onMapClick}
    onLoad={onMapLoad}
    >
        
        {markers.map(marker => ( //mapping the markers. For each marker, show the marker component.
        <Marker 
            key={marker.time.toISOString()} //adding a key (time) to make it unique for react
            position={{lat: marker.lat, lng: marker.lng}}
            onClick={() => {
                setSelected(marker)
            }} 
            ></Marker>
            ))}
            {selected ? (
                <InfoWindow 
                key={selected.time.toISOString()}
                position={{ lat: selected.lat, lng: selected.lng }} //object with lat/long
                onCloseClick={() =>{
                    setSelected(null)
                    }}
                    >
                    <div className="card">
                      <h2>Hidden gem!</h2>
                      <input onChange={(e) => setTitle(e.target.value)} />
                      <textarea onChange={(e) => setDesc(e.target.value)} />
                        <span className="username"> 
                        Created by<b>{currentUser}</b></span>
                        <p>Created at {formatRelative(selected.time, new Date())}</p>
                        <button className="submitButton" type="submit">
                          Add Hidden Gem!
                        </button>
                    </div>
                </InfoWindow>
                ) : null} 
    </GoogleMap>
    </>
    </div>
    ) 
}

function Locate ({panTo}) { //To get your current position
    return( 
    <button className="locate" onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
            panTo({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
        }, () => null
        )
    }}>
    <img src="compass-icon.png" alt="" />
    </button>
    )
}

function Search ({ panTo }) { //function search 
    const [address,setAddress] = useState("")
    const [coordinates,setCoordinates] = useState({
        lat:null, //no value
        lng:null 
    })

    const handleSelect = async value => { //Selecting the city
        const results = await geocodeByAddress(value)
        const {lat ,lng} = await getLatLng(results[0])
        panTo({lat, lng})
        setAddress(value)
        setCoordinates(lat, lng)
    }

    return ( //search rendering
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
                  placeholder: 'Search Spots ...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active //ternary operators while scrolling the 
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








