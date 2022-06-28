import ReactMapGL from "react-map-gl";
import { useEffect, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapBox() {
  const [viewport, setViewport] = useState({
      latitude: 45.4211,
      longitude: -75.6903,
      width: "100vw",
      height: "100vh",
      zoom: 10
  })

  return (
    <div>
      <ReactMapGL 
      {...viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      >markers here</ReactMapGL>
    </div>
  )

}
