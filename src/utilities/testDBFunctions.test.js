import { describe, it, expect, afterEach } from "vitest";
import {
  addIssue,
  deleteIssue,
  fetchIssueById,
  addComment,
  fetchComments,
  incrementCommentsCount,
  decrementCommentsCount,
  deleteComment,
} from "./dbFunctions.js";

describe("Firestore DB Functions", () => {
  let issueId;
  let commentId;

  const testIssue = {
    title: "Test Issue: Pothole",
    category: "Road Hazard",
    description: "Pothole on Main St",
    isResolved: false,
    location: {
      address: "Main St",
      latitude: "40.7128",
      longitude: "-74.0069",
    },
    photos: [],
    postDate: new Date().toISOString(),
    savedCount: 0,
    commentsCount: 0,
  };

  const testComment = {
    comment: "This is a test comment",
    date: new Date().toISOString(),
  };

  afterEach(async () => {
    if (commentId) {
      try {
        console.log("Deleting comment:", commentId);
        await deleteComment(issueId, commentId);
      } catch (err) {
        console.error("Failed to delete comment:", err);
      }
      commentId = null;
    }
    if (issueId) {
      try {
        console.log("Deleting issue:", issueId);
        await deleteIssue(issueId);
      } catch (err) {
        console.error("Failed to delete issue:", err);
      }
      issueId = null;
    }
  });

  it("should add an issue to Firestore", async () => {
    issueId = await addIssue(testIssue);
    expect(issueId).toBeDefined();
  });

  it("should fetch a single issue by ID", async () => {
    issueId = await addIssue(testIssue);
    const fetchedIssue = await fetchIssueById(issueId);
    expect(fetchedIssue).toBeDefined();
    expect(fetchedIssue.id).toBe(issueId);
    expect(fetchedIssue.title).toBe(testIssue.title);
  });

  it("should add a comment to an issue", async () => {
    issueId = await addIssue(testIssue);
    commentId = await addComment(issueId, testComment);
    expect(commentId).toBeDefined();
  });

  it("should fetch all comments for an issue", async () => {
    issueId = await addIssue(testIssue);
    commentId = await addComment(issueId, testComment);
    const comments = await fetchComments(issueId);
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.some((comment) => comment.id === commentId)).toBe(true);
  });

  it("should increment the comments count", async () => {
    issueId = await addIssue(testIssue);
    await incrementCommentsCount(issueId);
    const updatedIssue = await fetchIssueById(issueId);
    expect(updatedIssue.commentsCount).toBe(1);
  });

  it("should decrement the comments count", async () => {
    issueId = await addIssue(testIssue);
    await incrementCommentsCount(issueId);
    await decrementCommentsCount(issueId);
    const updatedIssue = await fetchIssueById(issueId);
    expect(updatedIssue.commentsCount).toBe(0);
  });

  it("should delete a comment by ID", async () => {
    issueId = await addIssue(testIssue);
    commentId = await addComment(issueId, testComment);
    await deleteComment(issueId, commentId);
    const comments = await fetchComments(issueId);
    expect(comments.some((comment) => comment.id === commentId)).toBe(false);
    commentId = null;
  });
});
