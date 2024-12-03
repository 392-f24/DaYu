// SafetyApp.js
import { useState, useEffect, useRef } from "react";
import { Box, Container, useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import CustomAppBar from "./components/CustomAppBar";
import MapArea from "./components/MapArea";
import IssuesList from "./components/IssuesList";
import {
  fetchIssues,
  getSavedIssuesDetails,
  addSavedIssue,
  removeSavedIssue,
} from "./utilities/dbFunctions";
import { isIssueSavedByUser } from "./utilities/issueUtils";

// Theme configuration
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3b82f6" }, // blue
    secondary: { main: "#22c55e" }, // green
    thirdColor: { main: "#f59e0b" }, // yellow
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
  const [mapCenter, setMapCenter] = useState({ lat: 42.05724, lng: -87.67767 });
  const [isIssuesListExpanded, setIsIssuesListExpanded] = useState(false); // State to control layout
  const mapRef = useRef(null); // Reference for the Google Map instance
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [issues, setIssues] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  // if showSaved = true, issues = result of savedIssues
  // if showSaved = false, issues = result of fetchIssues

  const handleIssueSelect = (issue) => {
    console.log("Selected issue:", issue);
    setSelectedIssue(issue.id);
    if (mapRef.current) {
      mapRef.current.panTo(issue.location.coordinates);
    }
  };

  const toggleExpand = () => {
    setIsIssuesListExpanded((prev) => !prev);
  };

  // hardcoded userID
  const userId = "0LXtAr9nEjGzBdXsNWyw";

  useEffect(() => {
    if (!showSaved) {
      // get all issues
      fetchIssues().then((data) => {
        console.log("Fetched issues:", data);
        setIssues(data);
      });
    } else {
      // get only saved issues
      getSavedIssuesDetails(userId).then((data) => {
        console.log("Fetched saved issues:", data);
        // for every issue, fecth the issue by id and add it to an array, then set issues to that array
        setIssues(data);
      });
    }
  }, [showSaved]);

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
                issues={issues}
                mapCenter={mapCenter}
                mapRef={mapRef}
                handleIssueSelect={handleIssueSelect}
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
              userId={userId}
              issues={issues}
              showSaved={showSaved}
              setShowSaved={setShowSaved}
              hoveredIssue={hoveredIssue}
              selectedIssue={selectedIssue}
              handleIssueSelect={handleIssueSelect}
              setHoveredIssue={setHoveredIssue}
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
