import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  useMediaQuery,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/material/styles";
import { useDrag } from "@use-gesture/react";
import IssueCard from "./IssueCard";

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
  height: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
}));

const ScrollableList = styled(List)(({ theme }) => ({
  height: "calc(100% - 56px)",
  overflowY: "auto",
  scrollbarWidth: "none", // For Firefox
  msOverflowStyle: "none", // For Internet Explorer and Edge

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
    console.log("issue:", issue);
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

  console.log("Filtered issues:", filteredIssues);

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

      {/* Filter Modal */}
      <Dialog open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <DialogTitle>Filter Issues</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Modes
          </Typography>
          <ToggleButtonGroup
            value={modalSelectedModes}
            onChange={(event, newModes) => setModalSelectedModes(newModes)}
            aria-label="Mode selection"
            size="small"
            sx={{ display: "flex", flexWrap: "wrap" }}
          >
            {modes.map((mode) => (
              <ToggleButton key={mode} value={mode} sx={{ minWidth: "80px" }}>
                {mode}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Category
          </Typography>
          <Select
            fullWidth
            value={modalSelectedCategory}
            size="small"
            onChange={(e) => setModalSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Resolution Status
          </Typography>
          <ToggleButtonGroup
            value={modalResolvedFilter}
            exclusive
            onChange={(event, newStatus) => setModalResolvedFilter(newStatus)}
            aria-label="Resolution status"
            size="small"
          >
            <ToggleButton value="all" sx={{ minWidth: "80px" }}>
              All
            </ToggleButton>
            <ToggleButton value="resolved">Resolved</ToggleButton>
            <ToggleButton value="unresolved">Unresolved</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Show Saved
          </Typography>
          <ToggleButtonGroup
            value={modalShowSaved ? "true" : "false"}
            exclusive
            onChange={() => setModalShowSaved((prev) => !prev)}
            aria-label="Saved filter"
            size="small"
          >
            <ToggleButton value="false" sx={{ minWidth: "130px" }}>
              All Issues
            </ToggleButton>
            <ToggleButton value="true" sx={{ minWidth: "130px" }}>
              Saved Issues
            </ToggleButton>
          </ToggleButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterModalOpen(false)}>Cancel</Button>
          <Button onClick={handleFilterApply} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IssuesList;