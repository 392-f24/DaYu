import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const mapStyle = [
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffffff" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "administrative",
    "elementType": "labels",
    "stylers": [{ "visibility": "on" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "color": "#ffcc00" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "color": "#cccccc" },
      { "weight": 1 }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "color": "#e3e3e3" },
      { "weight": 1 }
    ]
  }
]



const MapContainer = styled(Paper)(({ theme }) => ({
  height: "100%",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

const MapArea = ({ issues, mapCenter, mapRef, hoveredIssue, selectedIssue }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  // Wait a bit after the map has loaded
  useEffect(() => {
    if (mapLoaded) {
      const timer = setTimeout(() => setDelayComplete(true), 1000); // 1 second delay
      return () => clearTimeout(timer);
    }
  }, [mapLoaded]);

  return (
    <MapContainer elevation={0}>
      <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={14}
          options={{
            disableDefaultUI: true, // Hides default map controls
            styles: mapStyle,
          }}
          onLoad={(map) => {
            mapRef.current = map;
            setMapLoaded(true);
            console.log("Map loaded successfully");
          }}
        >
          {delayComplete &&
            issues.map((issue) => (
              <Marker
                key={issue.id}
                position={issue.coordinates}
                onClick={() => {
                  if (issue.id !== hoveredIssue && issue.id !== selectedIssue) {
                    mapRef.current.panTo(issue.coordinates);
                  }
                }}
              />
            ))}
        </GoogleMap>
      </LoadScriptNext>
    </MapContainer>
  );
};

export default MapArea;