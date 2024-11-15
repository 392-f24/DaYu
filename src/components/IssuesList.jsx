// IssuesList.js
import React from "react";
import { Box,Button, List, Paper, Typography } from "@mui/material";
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
    scrollbarWidth: "none", // For Firefox
    msOverflowStyle: "none", // For Internet Explorer and Edge
  
    "&::-webkit-scrollbar": {
      display: "none", // For Chrome, Safari, and other WebKit browsers
    },
  }));

  const IssuesList = ({
    issues,
    hoveredIssue,
    selectedIssue,
    handleIssueSelect,
    setHoveredIssue,
    getChipColor,
    formatTime,
    isExpanded,
    toggleExpand,
  }) => (
    <IssuesListContainer elevation={0}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div">
          Safety Issues
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show Map" : "Expand"}
        </Button>
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