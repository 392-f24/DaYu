import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Chip,
  IconButton,
  Button,
  TextField,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { formatTime } from "../utilities/time";
import { getChipColor } from "../utilities/color";
import { isIssueSavedByUser } from "../utilities/issueUtils";
import { toggleVerifiedIssue, getVerificationCount, hasUserVerifiedIssue, fetchComments, addComment, fetchUserData } from "../utilities/dbFunctions";

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
  saved,
  onToggleSave,
}) => {
  if (!issue) return null;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const [verified, setVerified] = useState(issue.verifiedBy?.includes(userId));
  const [localVerifiedCount, setLocalVerifiedCount] = useState(verifiedCount);
  
  const { title, description, location, postDate, category, isResolved } =
    issue;

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
  
      // Fetch user info and comments
      Promise.all([
        fetchUserData(userId),
        fetchComments(issue.id),
        hasUserVerifiedIssue(userId, issue.id),
        getVerificationCount(issue.id),
      ])
        .then(([user, fetchedComments, isVerified, count]) => {
          setUserInfo(user); // Store user's info
          setVerified(isVerified);
          setLocalVerifiedCount(count);
  
          const updatedComments = fetchedComments.map((comment) => ({
            ...comment,
            username: `${user?.firstname} ${user?.lastname}`,
            formattedDate: comment.date instanceof Date
              ? comment.date
              : comment.date?.toDate(),
          }));
  
          updatedComments.sort((a, b) => a.formattedDate - b.formattedDate);
  
          setComments(updatedComments);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, userId, issue.id]);
    

  const handleVerifyToggle = async () => {
    const newStatus = !verified;
    try {
      await toggleVerifiedIssue(userId, issue.id);
      setVerified(newStatus);
      // Update the verification count
      const updatedCount = await getVerificationCount(issue.id);
      setLocalVerifiedCount(updatedCount);
    } catch (error) {
      console.error("Error toggling verification:", error);
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
  
    const commentData = {
      comment: newComment,
      date: new Date(),
      user: userId,
      username: `${userInfo?.firstname} ${userInfo?.lastname}`,
      formattedDate: new Date(),
    };
  
    addComment(issue.id, commentData)
      .then(() => {
        setComments((prevComments) => [...prevComments, commentData]);
        setNewComment("");
      })
      .catch(console.error);
  };
  

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

        <Typography variant="body2" color="text.secondary">
          Resolved: {isResolved ? "Yes" : "No"}
        </Typography>

        {/* Verified count and saved toggle */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleVerifyToggle}>
              <CheckCircleOutline color={verified ? "success" : "disabled"} />
            </IconButton>
            <Typography variant="body2">
              Verified by {localVerifiedCount}
            </Typography>
          </Box>
          <IconButton onClick={onToggleSave}>
            {saved ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        {/* Comments section */}
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" gutterBottom>Comments</Typography>

        <Box
  sx={{
    maxHeight: 300, // Set the height limit for the comments section
    overflowY: "auto", // Enable vertical scrolling
    mb: 2,
    p: 1, // Optional padding for better spacing
    border: "1px solid #ccc", // Optional border for visual clarity
    borderRadius: "4px",
  }}
>
  {comments.length > 0 ? (
    comments.map((c, idx) => (
      <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar sx={{ mr: 1 }} />
        <Box>
          <Typography variant="body2" color="text.primary" fontWeight="bold">
            {c.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {c.comment}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            {c.formattedDate ? formatTime(c.formattedDate) : ""}
          </Typography>
        </Box>
      </Box>
    ))
  ) : (
    <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
      No comments yet.
    </Typography>
  )}
</Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a comment"
          multiline
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handlePostComment}>
          Post Comment
        </Button>
      </Box>
    </Modal>
  );
};

export default IssueModal;
