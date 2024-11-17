// IssueCard.js
import React from "react";
import { Box, Chip, ListItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

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

const IssueTitle = ({ title, category, getChipColor }) => (
  <Typography component="div" variant="subtitle1" sx={{ mb: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <span>{title}</span>
      <Chip
        label={category}
        size="small"
        color={getChipColor(category)}
        variant="outlined"
      />
    </Box>
  </Typography>
);

const IssueDetails = ({ description, address, timestamp, formatTime }) => (
  <Typography component="div" variant="body2" color="text.secondary">
    <Box sx={{ mb: 1 }}>{description}</Box>
    <Box sx={{ display: "flex", gap: 1, fontSize: "12px" }}>
      <span>{address}</span>
      <span>•</span>
      <span>{formatTime(timestamp)}</span>
    </Box>
  </Typography>
);

const IssueCard = ({
  issue,
  isSelected,
  isHovered,
  handleMouseEnter,
  handleMouseLeave,
  handleSelect,
  getChipColor,
  formatTime,
}) => (
  <StyledListItem
    onMouseEnter={() => handleMouseEnter(issue.id)}
    onMouseLeave={() => handleMouseLeave()}
    onClick={() => handleSelect(issue)}
    sx={{
      bgcolor: isHovered || isSelected ? "action.hover" : "transparent",
    }}
  >
    <Box sx={{ width: "100%" }}>
      <IssueTitle
        title={issue.title}
        category={issue.category}
        getChipColor={getChipColor}
      />
      <IssueDetails
        description={issue.description}
        address={issue.location.address}
        timestamp={issue.timestamp}
        formatTime={formatTime}
      />
    </Box>
  </StyledListItem>
);

export default IssueCard;
