import React from "react";
import {
  Modal,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { formatTime } from "../utilities/time";
import { getChipColor } from "../utilities/color";
import { isIssueSavedByUser } from "../utilities/issueUtils";
import { toggleSavedIssue } from "../utilities/dbFunctions";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
  outline: "none",
};

const IssueModal = ({
  userId,
  open,
  onClose,
  issue,
  handleVerifyIssue,
  verifiedCount,
}) => {
  if (!issue) return null;

  const { title, description, location, postDate, category } = issue;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Title and category */}
        <Typography variant="h5" gutterBottom>
          {title || "Title not specified"}
        </Typography>
        <Chip
          label={category || "No category"}
          size="small"
          color={getChipColor(category)}
          variant="outlined"
          sx={{ mb: 2 }}
        />

        {/* Description */}
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>

        {/* Location and post date */}
        <Typography variant="body2" color="text.secondary">
          Location: {location.address || "Not specified"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Posted on: {postDate ? formatTime(postDate) : "Date not available"}
        </Typography>

        {/* Verified count and star toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleVerifyIssue}>
              <CheckCircleOutline color="success" />
            </IconButton>
            <Typography variant="body2">
              {verifiedCount} verified by 10 people
            </Typography>
          </Box>
          <IconButton onClick={() => toggleSavedIssue(userId, issue.id)}>
            {isIssueSavedByUser(userId, issue) ? (
              <BookmarkIcon color="primary" />
            ) : (
              <BookmarkBorderIcon />
            )}
          </IconButton>
        </Box>

        {/* Comments section */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a comment"
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth>
          Post Comment
        </Button>
      </Box>
    </Modal>
  );
};

export default IssueModal;
