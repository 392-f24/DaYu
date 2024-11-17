import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDrag } from "@use-gesture/react";
import IssueCard from "./IssueCard";

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
  issues,
  hoveredIssue,
  selectedIssue,
  handleIssueSelect,
  setHoveredIssue,
  formatTime,
  isExpanded,
  toggleExpand,
}) => {
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
        </Box>
      </Box>
      <ScrollableList>
        {issues.map((issue) => (
          <IssueCard
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
  );
};

export default IssuesList;
