// MapArea.js
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MapPin } from "lucide-react";

const MapContainer = styled(Paper)(({ theme }) => ({
  height: "100%",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

const MapMarker = ({ position, isHighlighted }) => (
  <Box
    sx={{
      position: "absolute",
      transform: `translate(-50%, -50%) ${isHighlighted ? "scale(1.25)" : "scale(1)"}`,
      transition: "transform 0.2s",
      color: isHighlighted ? "primary.main" : "text.secondary",
      cursor: "pointer",
    }}
  >
    <MapPin />
  </Box>
);

const MapArea = ({ issues, mapCenter, mapRef, hoveredIssue, selectedIssue }) => {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  return (
    <MapContainer elevation={0}>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={13}
          options={{
            mapId: "YOUR_MAP_ID",
          }}
          onLoad={(map) => {
            mapRef.current = map;
            console.log("Map loaded:", map);
          }}
        >
          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={issue.coordinates}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </MapContainer>
  );
};

export default MapArea;