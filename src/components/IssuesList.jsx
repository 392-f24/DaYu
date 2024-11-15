// IssuesList.js
import React from "react";
import { Box, Chip, List, ListItem, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

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

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  cursor: "pointer",
  transition: theme.transitions.create(["background-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const IssueTitle = ({ title, type, getChipColor }) => (
  <Typography component="div" variant="subtitle1" sx={{ mb: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <span>{title}</span>
      <Chip label={type} size="small" color={getChipColor(type)} variant="outlined" />
    </Box>
  </Typography>
);

const IssueDetails = ({ description, location, timestamp, formatTime }) => (
  <Typography component="div" variant="body2" color="text.secondary">
    <Box sx={{ mb: 1 }}>{description}</Box>
    <Box sx={{ display: "flex", gap: 1, fontSize: "12px" }}>
      <span>{location}</span>
      <span>•</span>
      <span>{formatTime(timestamp)}</span>
    </Box>
  </Typography>
);

const IssuesList = ({ issues, hoveredIssue, selectedIssue, handleIssueSelect, setHoveredIssue, getChipColor, formatTime }) => (
  <IssuesListContainer elevation={0}>
    <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
      <Typography variant="h6" component="div">
        Safety Issues
      </Typography>
    </Box>
    <ScrollableList>
      {issues.map((issue) => (
        <StyledListItem
          key={issue.id}
          onMouseEnter={() => setHoveredIssue(issue.id)}
          onMouseLeave={() => setHoveredIssue(null)}
          onClick={() => handleIssueSelect(issue)}
          sx={{
            bgcolor: hoveredIssue === issue.id || selectedIssue === issue.id ? "action.hover" : "transparent",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <IssueTitle title={issue.title} type={issue.type} getChipColor={getChipColor} />
            <IssueDetails
              description={issue.description}
              location={issue.location}
              timestamp={issue.timestamp}
              formatTime={formatTime}
            />
          </Box>
        </StyledListItem>
      ))}
    </ScrollableList>
  </IssuesListContainer>
);

export default IssuesList;