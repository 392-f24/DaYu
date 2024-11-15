// SafetyApp.js
import React, { useState } from "react";
import { AppBar, Box, Container, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import MapArea from "./components/MapArea";
import IssuesList from "./components/IssuesList";

// Theme configuration
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3b82f6" },
    secondary: { main: "#22c55e" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#1e293b", secondary: "#64748b" },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiAppBar: { styleOverrides: { root: { backgroundImage: "none", backgroundColor: "#ffffff", color: "#1e293b" } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
  },
});

const DUMMY_ISSUES = [
  { id: 1, title: "Icy Sidewalk Conditions", description: "Multiple reports of dangerous ice patches", location: "Main St & 5th Ave", timestamp: "2024-11-12T08:30:00", type: "weather", severity: "high", coordinates: { lat: 40.7128, lng: -74.006 } },
  { id: 2, title: "Power Outage", description: "Affecting 200+ households in downtown area", location: "Downtown District", timestamp: "2024-11-12T09:15:00", type: "infrastructure", severity: "high", coordinates: { lat: 40.7148, lng: -74.004 } },
  { id: 3, title: "Road Construction", description: "Lane closure causing traffic delays", location: "Broadway & 3rd St", timestamp: "2024-11-12T07:45:00", type: "infrastructure", severity: "medium", coordinates: { lat: 40.7138, lng: -74.002 } },
];

const SafetyApp = () => {
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const getChipColor = (type) => (type === "weather" ? "primary" : "secondary");
  const handleIssueSelect = (issue) => {
    // TODO : modal popup
    setSelectedIssue(issue.id);
    setMapCenter(issue.coordinates);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" color="text.primary">Non-Crime Safety App</Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3, display: "flex", flexDirection: isSmallScreen ? "column" : "row", gap: 3, height: "calc(100vh - 100px)" }}>
          <Box sx={{ width: isSmallScreen ? "100%" : "75%", height: isSmallScreen ? "50vh" : "100%" }}>
            <MapArea
              issues={DUMMY_ISSUES}
              mapCenter={mapCenter}
              hoveredIssue={hoveredIssue}
              selectedIssue={selectedIssue}
            />
          </Box>
          <Box sx={{ width: isSmallScreen ? "100%" : "25%", height: isSmallScreen ? "50vh" : "100%", overflowY: "auto" }}>
            <IssuesList
              issues={DUMMY_ISSUES}
              hoveredIssue={hoveredIssue}
              selectedIssue={selectedIssue}
              handleIssueSelect={handleIssueSelect}
              setHoveredIssue={setHoveredIssue}
              getChipColor={getChipColor}
              formatTime={formatTime}
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SafetyApp;