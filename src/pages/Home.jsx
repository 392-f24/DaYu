import { useState, useEffect, useRef } from "react";
import { Box, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomAppBar from "../components/CustomAppBar";
import MapArea from "../components/MapArea";
import IssuesList from "../components/IssuesList";
import { fetchIssues, getSavedIssuesDetails } from "../utilities/dbFunctions";

const Home = ({ userId }) => {
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

  useEffect(() => {
    if (!showSaved) {
      // get all issues
      fetchIssues().then((data) => {
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
  );
};

export default Home;
