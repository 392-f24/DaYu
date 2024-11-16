// SafetyApp.js
import { useState, useRef} from "react";
import { Box, Container, useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import CustomAppBar from "./components/CustomAppBar";
import MapArea from "./components/MapArea";
import IssuesList from "./components/IssuesList";
import { DUMMY_ISSUES } from "./data/dummyData";
import { getChipColor } from "./utilities/color";
import { formatTime } from "./utilities/time";

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
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#ffffff",
          color: "#1e293b",
        },
      },
    },
    // tags
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
  },
});

const SafetyApp = () => {
  const [hoveredIssue, setHoveredIssue] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 41.8781, lng: -87.6298 });
  const [isIssuesListExpanded, setIsIssuesListExpanded] = useState(false); // State to control layout
  const mapRef = useRef(null); // Reference for the Google Map instance
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue.id);
    if (mapRef.current) {
      mapRef.current.panTo(issue.coordinates);
    }
  };

  const toggleExpand = () => {
    setIsIssuesListExpanded((prev) => !prev);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <CustomAppBar />
        <Container
          maxWidth="xl"
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 3,
            height: "calc(100vh - 100px)",
          }}
        >
          {/* Map Area */}
          {!isIssuesListExpanded && (
            <Box
              sx={{
                width: isSmallScreen ? "100%" : "75%",
                height: isSmallScreen ? "50vh" : "100%",
                flexShrink: 0,
              }}
            >
              <MapArea
                issues={DUMMY_ISSUES}
                mapCenter={mapCenter}
                mapRef={mapRef}
                hoveredIssue={hoveredIssue}
                selectedIssue={selectedIssue}
              />
            </Box>
          )}
          {/* Issues List */}
          <Box
            sx={{
              width: isSmallScreen || isIssuesListExpanded ? "100%" : "25%",
              height: isSmallScreen
                ? isIssuesListExpanded
                  ? "100%"
                  : "50vh"
                : "100%",
              overflow: "hidden",
              flexGrow: isIssuesListExpanded ? 1 : 0,
            }}
          >
            <IssuesList
              issues={DUMMY_ISSUES}
              hoveredIssue={hoveredIssue}
              selectedIssue={selectedIssue}
              handleIssueSelect={handleIssueSelect}
              setHoveredIssue={setHoveredIssue}
              getChipColor={getChipColor}
              formatTime={formatTime}
              isExpanded={isIssuesListExpanded}
              toggleExpand={toggleExpand}
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SafetyApp;
