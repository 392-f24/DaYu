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
  Timestamp,
  increment,
} from "firebase/firestore";

// Add a new issue
export const addIssue = async (issue) => {
  try {
    const docRef = await addDoc(collection(db, "issues"), issue);
    return docRef.id;
  } catch (error) {
    console.error("Error adding issue: ", error);
    throw error;
  }
};

// Fetch all issues
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

// Update an issue
// Not exactly sure when we would need this except for setting an issue to resolved
export const updateIssue = async (id, updates) => {
  try {
    const issueRef = doc(db, "issues", id);
    await updateDoc(issueRef, updates);
  } catch (error) {
    console.error("Error updating issue: ", error);
    throw error;
  }
};

// Delete an issue
// Not sure when we would need this b/c we will be resolving issues
export const deleteIssue = async (id) => {
  try {
    await deleteDoc(doc(db, "issues", id));

    const deletedDoc = await fetchIssueById(id);
    if (deletedDoc) {
      throw new Error("Issue was not deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting issue: ", error);
    throw error;
  }

  await delay(500);
};

// add an issue to a user's saved issues
export const addSavedIssue = async (userId, issueId) => {
  try {
    const savedIssuesRef = collection(db, `users/${userId}/savedIssues`);

    // check if issue is already added
    const q = query(savedIssuesRef, where("savedIssue", "==", issueId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log(`Issue ${issueId} is already saved.`);
      return null;
    }

    // create new saved issue
    const newSavedIssue = {
      savedIssue: `/issues/${issueId}`,
      savedDate: Timestamp.now(),
    };

    const docRef = await addDoc(savedIssuesRef, newSavedIssue);
    return docRef.id;
  } catch (error) {
    console.error("Error adding saved issue:", error);
    throw error;
  }
};

// remove an issue from a user's saved issues
export const removeSavedIssue = async (userId, issueId) => {
  try {
    const savedIssuesRef = collection(db, `users/${userId}/savedIssues`);
    const q = query(
      savedIssuesRef,
      where("savedIssue", "==", `/issues/${issueId}`)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error removing saved issue:", error);
    throw error;
  }
};

// get all of a user's saved issues
export const getSavedIssues = async (userId) => {
  try {
    const savedIssuesRef = collection(db, `users/${userId}/savedIssues`);
    const querySnapshot = await getDocs(savedIssuesRef);

    const savedIssues = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return savedIssues;
  } catch (error) {
    console.error("Error retrieving saved issues:", error);
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
      commentsCount: increment(1),
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

// Fetch every issue for a user's saved issues
export const getSavedIssuesDetails = async (userId) => {
  try {
    // Step 1: Get all saved issue references from the user's savedIssues subcollection
    const savedIssues = await getSavedIssues(userId);

    // Step 2: Map through savedIssues and fetch full issue details for each savedIssue
    const issuesPromises = savedIssues.map(async (issue) => {
      const issueId = issue.issueId.id; // Extract issue ID from the savedIssue path
      return await fetchIssueById(issueId); // Fetch full issue details
    });

    // Step 3: Resolve all issue promises and return the full list of issue objects
    const fullIssues = await Promise.all(issuesPromises);

    return fullIssues;
  } catch (error) {
    console.error("Error fetching saved issue details:", error);
    throw error;
  }
};
