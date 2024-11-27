// testVerifiedIssues.js
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  addIssue,
  deleteIssue,
  fetchIssueById,
  addVerifiedIssue,
  removeVerifiedIssue,
  getVerifiedIssues,
  getVerifiedIssuesDetails,
  toggleVerifiedIssue,
} from "./dbFunctions.js";

describe("Verified Issues Functions", () => {
  let issueId;
  const userId = "testUserId";

  const testIssue = {
    title: "Test Issue: Broken Bench",
    category: "Public Property",
    description: "A bench is broken in the park",
    isResolved: false,
    location: {
      address: "Central Park",
      latitude: "40.785091",
      longitude: "-73.968285",
    },
    photos: [],
    postDate: new Date().toISOString(),
    savedCount: 0,
    commentsCount: 0,
  };

  beforeEach(async () => {
    issueId = await addIssue(testIssue);
  });

  afterEach(async () => {
    if (issueId) {
      try {
        await removeVerifiedIssue(userId, issueId);
        await deleteIssue(issueId);
      } catch (err) {
        console.error("Failed to clean up after test:", err);
      }
      issueId = null;
    }
  });

  it("should add a verified issue for a user", async () => {
    const result = await addVerifiedIssue(userId, issueId);
    expect(result).toEqual({ status: "added", issueId });

    const updatedIssue = await fetchIssueById(issueId);

    const userPath = `users/${userId}`;
    const verifiedByPaths = (updatedIssue.verifiedBy || []).map(
      (ref) => ref.path
    );

    expect(verifiedByPaths).toContain(userPath);
  });

  it("should not add the same verified issue again", async () => {
    await addVerifiedIssue(userId, issueId);
    const result = await addVerifiedIssue(userId, issueId);
    expect(result).toBeNull();
  });

  it("should remove a verified issue for a user", async () => {
    await addVerifiedIssue(userId, issueId);
    await removeVerifiedIssue(userId, issueId);

    const updatedIssue = await fetchIssueById(issueId);
    const userPath = `users/${userId}`;
    const verifiedByPaths = (updatedIssue.verifiedBy || []).map(
      (ref) => ref.path
    );

    expect(verifiedByPaths).not.toContain(userPath);
  });

  it("should get all verified issues for a user", async () => {
    let verifiedIssues = await getVerifiedIssues(userId);
    expect(verifiedIssues.length).toBe(0);

    await addVerifiedIssue(userId, issueId);

    verifiedIssues = await getVerifiedIssues(userId);
    expect(verifiedIssues.length).toBe(1);
    expect(verifiedIssues[0].issueId.path).toBe(`issues/${issueId}`);
  });

  it("should fetch detailed information for all verified issues", async () => {
    await addVerifiedIssue(userId, issueId);

    const issuesDetails = await getVerifiedIssuesDetails(userId);
    expect(issuesDetails.length).toBe(1);
    expect(issuesDetails[0].id).toBe(issueId);
    expect(issuesDetails[0].title).toBe(testIssue.title);
  });

  it("should toggle verified issue status for a user", async () => {
    let result = await toggleVerifiedIssue(userId, issueId);
    expect(result).toEqual({ status: "added", issueId });

    let updatedIssue = await fetchIssueById(issueId);
    const userPath = `users/${userId}`;
    let verifiedByPaths = (updatedIssue.verifiedBy || []).map(
      (ref) => ref.path
    );
    expect(verifiedByPaths).toContain(userPath);

    result = await toggleVerifiedIssue(userId, issueId);
    expect(result).toEqual({ status: "removed", issueId });

    updatedIssue = await fetchIssueById(issueId);
    verifiedByPaths = (updatedIssue.verifiedBy || []).map((ref) => ref.path);
    expect(verifiedByPaths).not.toContain(userPath);
  });
});
