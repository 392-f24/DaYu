// IssueCard.js
import React, { useState } from "react";
import { Box, Chip, ListItem, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Bookmark from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { formatTime } from "../utilities/time";
import { getChipColor } from "../utilities/color";
import { isIssueSavedByUser } from "../utilities/issueUtils";
import { toggleSavedIssue } from "../utilities/dbFunctions";
import IssueModal from "./IssueModal";

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

const IssueCard = ({
  userId,
  issue,
  isSelected,
  isHovered,
  handleMouseEnter,
  handleMouseLeave,
  handleSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saved, setSaved] = useState(isIssueSavedByUser(userId, issue));

  const handleOnClick = () => {
    toggleSavedIssue(userId, issue.id);
    setSaved((prev) => !prev);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCardClick = () => {
    handleSelect(issue);
    setIsModalOpen(true);
  };

  return (
    <Box>
      <StyledListItem
        onMouseEnter={() => handleMouseEnter(issue.id)}
        onMouseLeave={() => handleMouseLeave()}
        onClick={handleCardClick}
        sx={{
          bgcolor: isHovered || isSelected ? "action.hover" : "transparent",
        }}
      >
        <Box sx={{ width: "100%" }}>
          {/* ISSUE TITLE */}
          <Typography component="div" variant="subtitle1">
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {issue.title}
              <IconButton
                aria-label="save issue"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOnClick();
                }}
              >
                {saved ? (
                  <Bookmark fontSize="inherit" color="primary" />
                ) : (
                  <BookmarkBorderIcon fontSize="inherit" />
                )}
              </IconButton>
            </Box>
          </Typography>

          <Chip
            label={issue.category}
            size="small"
            color={getChipColor(issue.category)}
            variant="outlined"
          />

          <Typography component="div" variant="body2" color="text.secondary">
            <Box
              sx={{
                mb: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {issue.description}
            </Box>
            <Box sx={{ display: "flex", gap: 1, fontSize: "12px" }}>
              <span>{issue.location.address.split(",")[0]}</span>
              <span>•</span>
              <span>{formatTime(issue.postDate)}</span>
            </Box>
          </Typography>
        </Box>
      </StyledListItem>
      <IssueModal
        userId={userId}
        open={isModalOpen}
        onClose={handleModalClose}
        issue={issue}
        saved={saved}
        onToggleSave={handleOnClick}
      />
    </Box>
  );
};

export default IssueCard;
