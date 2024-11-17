import { describe, it, expect, afterEach, beforeEach } from "vitest";
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
      await deleteComment(issueId);
      commentId = null;
    }

    if (issueId) {
      await deleteIssue(issueId);
      issueId = null;
    }
  });

  it("should add an issue to Firestore", async () => {
    const issueId = await addIssue(testIssue);
    expect(issueId).toBeDefined();
  });

  it("should fetch a single issue by ID", async () => {
    issueId = await addIssue(testIssue);
    const fetchedIssue = await fetchIssueById(issueId);
    expect(fetchedIssue).toBeDefined();
    expect(fetchedIssue.id).toBe(issueId);
    expect(fetchedIssue.title).toBe(testIssue.title);
  });
});
