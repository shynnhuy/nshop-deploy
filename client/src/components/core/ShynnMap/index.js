import React, { useState, useCallback, useRef, memo } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import useStyles, { mapStyles as styles } from "./styles";
import SearchBox from "./SearchBox";
import Locate from "./Locate";
import { Button } from "@material-ui/core";

const API_KEY = "AIzaSyC8biiit3Gf7h4oAUNP2hSTCJSqOApyiTA";
const libraries = ["places"];

const containerStyle = {
  height: "500px",
};

const center = {
  lat: 16.047079,
  lng: 108.20623,
};

const options = {
  styles,
  disableDefaultUI: true,
  zoomControl: true,
};

function ShynnMap({ get, place }) {
  const classes = useStyles();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [marker, setMarker] = useState(center);

  const onMapClick = useCallback((event) => {
    // console.log(event);
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
    setMarker({ lat, lng });
  }, []);

  if (loadError) return "Error loading google map API";
  if (!isLoaded) return "Loading Map...";

  return (
    <div className={classes.root}>
      <SearchBox panTo={panTo} place={place} />
      <Locate panTo={panTo} />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        <Marker position={marker} />
      </GoogleMap>
      <Button
        variant="outlined"
        color="primary"
        className={classes.choose}
        onClick={() => console.log(marker)}
      >
        Choose
      </Button>
    </div>
  );
}

export default memo(ShynnMap);

// const [map, setMap] = React.useState(null);

// const onLoad = React.useCallback(function callback(map) {
//   const bounds = new window.google.maps.LatLngBounds();
//   map.fitBounds(bounds);
//   setMap(map);
//   console.log(map);
// }, []);

// const onUnmount = React.useCallback(function callback(map) {
//   setMap(null);
// }, []);
