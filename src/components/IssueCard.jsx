// IssueCard.js
import React from "react";
import { Box, Chip, ListItem, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { formatTime } from "../utilities/time";
import { getChipColor } from "../utilities/color";
import { isIssueSavedByUser } from "../utilities/issueUtils";
import { toggleSavedIssue } from "../utilities/dbFunctions";

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

const IssueTitle = ({ title, category, isSaved, issue, userId }) => (
  <Typography component="div" variant="subtitle1" sx={{ mb: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <IconButton
          aria-label="save issue"
          size="small"
          onClick={() => toggleSavedIssue(userId, issue.id)}
        >
          {isSaved ? (
            <Bookmark fontSize="inherit" color="primary" />
          ) : (
            <BookmarkBorderIcon fontSize="inherit" />
          )}
        </IconButton>
        {title}
      </Box>
      <Chip
        label={category}
        size="small"
        color={getChipColor(category)}
        variant="outlined"
      />
    </Box>
  </Typography>
);

const IssueDetails = ({ description, address, postDate }) => (
  <Typography component="div" variant="body2" color="text.secondary">
    <Box sx={{ mb: 1 }}>{description}</Box>
    <Box sx={{ display: "flex", gap: 1, fontSize: "12px" }}>
      <span>{address}</span>
      <span>•</span>
      <span>{formatTime(postDate)}</span>
    </Box>
  </Typography>
);

const IssueCard = ({
  userId,
  issue,
  isSelected,
  isHovered,
  handleMouseEnter,
  handleMouseLeave,
  handleSelect,
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
        isSaved={isIssueSavedByUser(userId, issue)}
        issue={issue}
        userId={userId}
      />
      <IssueDetails
        description={issue.description}
        address={issue.location.address}
        postDate={issue.postDate}
      />
    </Box>
  </StyledListItem>
);

export default IssueCard;
