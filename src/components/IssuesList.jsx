import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/material/styles";
import { useDrag } from "@use-gesture/react";
import IssueCard from "./IssueCard";
import FilterModal from "./FilterModal";

// hardcoded for now
const modes = ["Pedestrian", "Cyclist", "Driver"];
const categories = [
  "Road Hazard",
  "Property",
  "Lighting",
  "Waste Management",
  "Traffic",
  "Accessibility",
  "Sidewalks",
  "Other",
];

const IssuesListContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

const ScrollableList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  scrollbarWidth: "none", // For Firefox
  msOverflowStyle: "none", // For IE and Edge

  "&::-webkit-scrollbar": {
    display: "none", // For Chrome, Safari, and other WebKit browsers
  },
}));

const SwipeHandle = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "4px",
  backgroundColor: theme.palette.text.secondary,
  borderRadius: "2px",
  position: "absolute",
  top: "4px", // Positions the handle at the very top of the container
  left: "50%",
  transform: "translateX(-50%)",
  cursor: "pointer", // Indicate that the handle is interactive
}));

const IssuesList = ({
  userId,
  issues,
  showSaved,
  setShowSaved,
  hoveredIssue,
  selectedIssue,
  handleIssueSelect,
  setHoveredIssue,
  formatTime,
  isExpanded,
  toggleExpand,
}) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedModes, setSelectedModes] = useState(modes);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [resolvedFilter, setResolvedFilter] = useState("all");

  // Local state for modal filters
  const [modalShowSaved, setModalShowSaved] = useState(showSaved);
  const [modalSelectedModes, setModalSelectedModes] = useState(selectedModes);
  const [modalSelectedCategory, setModalSelectedCategory] =
    useState(selectedCategory);
  const [modalResolvedFilter, setModalResolvedFilter] =
    useState(resolvedFilter);

  // Sync modal state with main state when modal opens
  useEffect(() => {
    if (filterModalOpen) {
      setModalShowSaved(showSaved);
      setModalSelectedModes(selectedModes);
      setModalSelectedCategory(selectedCategory);
      setModalResolvedFilter(resolvedFilter);
    }
  }, [
    filterModalOpen,
    showSaved,
    selectedModes,
    selectedCategory,
    resolvedFilter,
  ]);

  const handleFilterApply = () => {
    setShowSaved(modalShowSaved);
    setSelectedModes(modalSelectedModes);
    setSelectedCategory(modalSelectedCategory);
    setResolvedFilter(modalResolvedFilter);
    setFilterModalOpen(false);
    console.log("Filters applied:");
    console.log("showSaved:", modalShowSaved);
    console.log("selectedModes:", modalSelectedModes);
    console.log("selectedCategory:", modalSelectedCategory);
    console.log("resolvedFilter:", modalResolvedFilter);
  };

  const filteredIssues = issues.filter((issue) => {
    //console.log("issue:", issue);
    const modeMatch = selectedModes.some(
      (mode) => issue.mode && issue.mode.includes(mode)
    );
    const categoryMatch =
      selectedCategory === "all" || selectedCategory === issue.category;
    const resolvedMatch =
      resolvedFilter === "all" ||
      (resolvedFilter === "resolved" && issue.isResolved) ||
      (resolvedFilter === "unresolved" && !issue.isResolved);

    return modeMatch && categoryMatch && resolvedMatch;
  });

  //console.log("Filtered issues:", filteredIssues);

  // Set up the swipe gesture on the title
  const bind = useDrag(
    ({ direction: [, dy] }) => {
      if (dy < 0 && !isExpanded) toggleExpand(); // Swipe up to expand
      if (dy > 0 && isExpanded) toggleExpand(); // Swipe down to collapse
    },
    {
      filterTaps: true,
      threshold: 10, // Sensitivity for detecting a swipe
    }
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <IssuesListContainer elevation={0}>
        <Box
          sx={{
            position: "relative",
            padding: "16px 0",
            borderBottom: 1,
            borderColor: "divider",
            touchAction: "none",
          }}
          {...bind()}
        >
          {isSmallScreen && <SwipeHandle />}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" component="div">
              Safety Issues
            </Typography>
            <IconButton
              onClick={() => setFilterModalOpen(true)}
              sx={{ position: "absolute", top: 10, right: 10 }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        </Box>
        <ScrollableList>
          {filteredIssues.map((issue) => (
            <IssueCard
              userId={userId}
              key={issue.id}
              issue={issue}
              isSelected={selectedIssue === issue.id}
              isHovered={hoveredIssue === issue.id}
              handleMouseEnter={setHoveredIssue}
              handleMouseLeave={() => setHoveredIssue(null)}
              handleSelect={handleIssueSelect}
            />
          ))}
        </ScrollableList>
      </IssuesListContainer>
      <FilterModal 
        filterModalOpen={filterModalOpen}
        setFilterModalOpen={setFilterModalOpen}
        modes={modes}
        categories={categories}
        modalSelectedModes={modalSelectedModes}
        setModalSelectedModes={setModalSelectedModes}
        modalSelectedCategory={modalSelectedCategory}
        setModalSelectedCategory={setModalSelectedCategory}
        modalResolvedFilter={modalResolvedFilter}
        setModalResolvedFilter={setModalResolvedFilter}
        modalShowSaved={modalShowSaved}
        setModalShowSaved={setModalShowSaved}
        handleFilterApply={handleFilterApply}
      />
    </>
  );
};

export default IssuesList;