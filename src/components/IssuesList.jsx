// IssuesList.js
import React from "react";
import { Box, List, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
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
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    borderRadius: "4px",
  },
}));

const IssuesList = ({ issues, hoveredIssue, selectedIssue, handleIssueSelect, setHoveredIssue, getChipColor, formatTime }) => (
  <IssuesListContainer elevation={0}>
    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
      <Typography variant="h6" component="div">
        Safety Issues
      </Typography>
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
          getChipColor={getChipColor}
          formatTime={formatTime}
        />
      ))}
    </ScrollableList>
  </IssuesListContainer>
);

export default IssuesList;