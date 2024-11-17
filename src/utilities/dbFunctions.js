// dbFunctions.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

// Add a new issue -- TESTED
export const addIssue = async (issue) => {
  try {
    const docRef = await addDoc(collection(db, "issues"), issue);
    return docRef.id;
  } catch (error) {
    console.error("Error adding issue: ", error);
    throw error;
  }
};

// Fetch all issues -- UNTESTED
export const fetchIssues = async (isResolved = false) => {
  try {
    const q = query(
      collection(db, "issues"),
      where("isResolved", "==", isResolved)
    );
    const querySnapshot = await getDocs(q);
    const issues = [];
    querySnapshot.forEach((doc) => {
      issues.push({ id: doc.id, ...doc.data() });
    });
    return issues;
  } catch (error) {
    console.error("Error fetching issues: ", error);
    throw error;
  }
};

// Update an issue -- UNTESTED
export const updateIssue = async (id, updates) => {
  try {
    const issueRef = doc(db, "issues", id);
    await updateDoc(issueRef, updates);
  } catch (error) {
    console.error("Error updating issue: ", error);
    throw error;
  }
};

// Delete an issue -- UNTESTED
export const deleteIssue = async (id) => {
  try {
    await deleteDoc(doc(db, "issues", id));
  } catch (error) {
    console.error("Error deleting issue: ", error);
    throw error;
  }
};

// Fetch a single issue -- TESTED
export const fetchIssueById = async (id) => {
  try {
    const issueRef = doc(db, "issues", id);
    const issueSnap = await getDoc(issueRef);
    if (issueSnap.exists()) {
      return { id: issueSnap.id, ...issueSnap.data() };
    } else {
      throw new Error("Issue not found");
    }
  } catch (error) {
    console.error("Error fetching issue by ID: ", error);
    throw error;
  }
};

// Add a new comment to an issue -- UNTESTED
export const addComment = async (issueId, comment) => {
  try {
    const commentRef = await addDoc(
      collection(db, "issues", issueId, "comments"),
      comment
    );
    return commentRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

// Fetch all comments for an issue -- UNTESTED
export const fetchComments = async (issueId) => {
  try {
    const q = collection(db, "issues", issueId, "comments");
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
  } catch (error) {
    console.error("Error fetching comments: ", error);
    throw error;
  }
};

// Increment commentsCount when a comment is added -- UNTESTED
export const incrementCommentsCount = async (issueId) => {
  try {
    const issueRef = doc(db, "issues", issueId);
    await updateDoc(issueRef, {
      commentsCount: increment(1), // Firestore increment function
    });
  } catch (error) {
    console.error("Error incrementing commentsCount: ", error);
    throw error;
  }
};

// Decrement commentsCount when a comment is deleted -- UNTESTED
export const decrementCommentsCount = async (issueId) => {
  try {
    const issueRef = doc(db, "issues", issueId);
    await updateDoc(issueRef, {
      commentsCount: increment(-1),
    });
  } catch (error) {
    console.error("Error decrementing commentsCount: ", error);
    throw error;
  }
};

// Delete a comment by ID -- UNTESTED
export const deleteComment = async (issueId, commentId) => {
  try {
    await deleteDoc(doc(db, "issues", issueId, "comments", commentId));
  } catch (error) {
    console.error("Error deleting comment: ", error);
    throw error;
  }
};
