import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useEffect, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";
import { format } from "date-fns";
import user from "reducers/user";

const MapBox = () => {

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null);
  const [desc, setDesc] = useState(null); 
  const [title, setTitle] = useState(null);
  const [star, setStar] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [viewState, setViewState] = useState({
    latitude: 57.72101,
    longitude: 12.9401,
    zoom: 10,
  });

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: user,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat.toArray()
    setNewPlace({
      lat: latitude,
      long: longitude,
    })
  };
  
  return (
    <div style={{ height: "100vh", width: "100%"}}>
      <ReactMapGL
        {...viewState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        minZoom={1}
        maxZoom={15}
        onClick = {user && handleAddClick}
        transitionDuration="200"
      >
        
        {pins.map((p)=> (
          <>
        <Marker
        
        latitude={57.72101} 
        longitude={12.9401}
        offsetLeft={-20}
        offsetTop={-10}
        anchor="left"
        draggable={true}
        scale={1}
        onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
        >
        </Marker>
        {p._id === currentPlaceId && (
    <Popup
      key={p._id}
      latitude={p.lat}
      longitude={p.long}
      closeButton={true}
      closeOnClick={false}
      onClose={() => setCurrentPlaceId(null)}
      anchor="left">
      <div className="card">
        <label>Place</label>
        <h4 className="place">{p.title}</h4>  
        <label>Review</label>
        <p className="desc">{p.desc}</p>
        <label>Information</label>
        <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
      </div>
      </Popup>
        )}
      </>
       ))}
       {newPlace && (
         <>
         <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewState.zoom}
              offsetTop={-7 * viewState.zoom}
            >
              </Marker>
     <Popup 
      latitude={newPlace.lat}
      longitude={newPlace.long} 
      anchor="left"
      closeButton ={true}
      closeOnClick={false}
      onClose={() => setNewPlace(null)}
      >
      <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button 
                  type="submit" 
                  className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
    </Popup> 
    </>
    )}
      </ReactMapGL>
    </div>
  );
}

export default MapBox;
