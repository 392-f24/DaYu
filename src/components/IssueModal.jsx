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
import { Star, StarBorder, CheckCircleOutline } from "@mui/icons-material";

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
  open,
  onClose,
  issue,
  handleStarToggle,
  isStarred,
  handleVerifyIssue,
  verifiedCount,
}) => {
  if (!issue) return null; // Prevent rendering without issue data

  const { title, description, location, timestamp, type } = issue;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Title and category */}
        <Typography variant="h5" gutterBottom>
          {title || "Title not specified"}
        </Typography>
        <Chip label={type || "No category"} color="primary" sx={{ mb: 2 }} />

        {/* Description */}
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>

        {/* Location and timestamp */}
        <Typography variant="body2" color="text.secondary">
          Location: {location || "Not specified"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Posted on:{" "}
          {timestamp
            ? new Date(timestamp).toLocaleString()
            : "Date not available"}
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
            <Typography variant="body2">{verifiedCount} verified by 10 people</Typography>
          </Box>
          <IconButton onClick={handleStarToggle}>
            {isStarred ? <Star color="primary" /> : <StarBorder />}
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
