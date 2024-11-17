// MapArea.js
import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
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
      transform: `translate(-50%, -50%) ${
        isHighlighted ? "scale(1.25)" : "scale(1)"
      }`,
      transition: "transform 0.2s",
      color: isHighlighted ? "primary.main" : "text.secondary",
      cursor: "pointer",
    }}
  >
    <MapPin />
  </Box>
);

const MapArea = ({ issues, mapCenter, hoveredIssue, selectedIssue }) => (
  <MapContainer elevation={0}>
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultZoom={13}
        center={mapCenter}
        mapId="YOUR_MAP_ID"
        style={{ width: "100%", height: "100%" }}
      >
        {issues.map((issue) => (
          <MapMarker
            key={issue.id}
            position={issue.location.coordinates}
            isHighlighted={
              hoveredIssue === issue.id || selectedIssue === issue.id
            }
          />
        ))}
      </Map>
    </APIProvider>
  </MapContainer>
);

export default MapArea;
