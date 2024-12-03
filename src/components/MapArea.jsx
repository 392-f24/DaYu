import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScriptNext,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Paper, Typography, Box, Chip, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatTime } from "../utilities/time";

const mapStyle = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#ffffff" }, { weight: 1 }],
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#ffcc00" }, { weight: 1 }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#cccccc" }, { weight: 1 }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ visibility: "on" }, { color: "#e3e3e3" }, { weight: 1 }],
  },
];

const MapContainer = styled(Paper)(({ theme }) => ({
  height: "100%",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

const MapArea = ({ issues, mapCenter, mapRef, handleIssueSelect }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [delayComplete, setDelayComplete] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

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

  const handleMarkerClick = (issue) => {
    if (mapRef.current) {
      mapRef.current.panTo(issue.location.coordinates);
    }

    setSelectedMarker(issue);

    setTimeout(() => {
      handleIssueSelect(issue);
    }, 100);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  return (
    <MapContainer elevation={0}>
      <LoadScriptNext
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      >
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
          {delayComplete && selectedMarker && (
            <InfoWindow
              position={selectedMarker.location.coordinates}
              onCloseClick={handleInfoWindowClose}
            >
              <Box sx={{ p: 2, maxWidth: 250 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {selectedMarker.title}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {selectedMarker.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={selectedMarker.category}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(selectedMarker.postDate)}
                  </Typography>
                </Box>
              </Box>
            </InfoWindow>
          )}

          {delayComplete &&
            issues.map((issue) => (
              <Marker
                key={issue.id}
                position={issue.location.coordinates}
                onClick={() => handleMarkerClick(issue)}
              />
            ))}
        </GoogleMap>
      </LoadScriptNext>
    </MapContainer>
  );
};

export default MapArea;
