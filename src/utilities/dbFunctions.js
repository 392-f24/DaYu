// dbFunctions.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

// Add a new issue
export const addIssue = async (issue) => {
  try {
    const docRef = await addDoc(collection(db, 'issues'), issue);
    return docRef.id;
  } catch (error) {
    console.error('Error adding issue: ', error);
    throw error;
  }
};

// Fetch all issues
export const fetchIssues = async (isResolved = false) => {
  try {
    const q = query(collection(db, 'issues'), where('isResolved', '==', isResolved));
    const querySnapshot = await getDocs(q);
    const issues = [];
    querySnapshot.forEach((doc) => {
      issues.push({ id: doc.id, ...doc.data() });
    });
    return issues;
  } catch (error) {
    console.error('Error fetching issues: ', error);
    throw error;
  }
};

// Update an issue
// Not exactly sure when we would need this except for setting an issue to resolved
export const updateIssue = async (id, updates) => {
  try {
    const issueRef = doc(db, 'issues', id);
    await updateDoc(issueRef, updates);
  } catch (error) {
    console.error('Error updating issue: ', error);
    throw error;
  }
};

// Delete an issue
// Not sure when we would need this b/c we will be resolving issues
export const deleteIssue = async (id) => {
  try {
    await deleteDoc(doc(db, 'issues', id));
  } catch (error) {
    console.error('Error deleting issue: ', error);
    throw error;
  }
};

// add an issue to a user's saved issues
export const addSavedIssue = async (userId, issueId) => {
  try {
    const savedIssuesRef = collection(db, `users/${userId}/savedIssues`);

    // check if issue is already added
    const q = query(savedIssuesRef, where('savedIssue', '==', issueId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log(`Issue ${issueId} is already saved.`);
      return null;
    }

    // create new saved issue
    const newSavedIssue = {
      savedIssue: `/issues/${issueId}`,
      savedDate: Timestamp.now()
    };

    const docRef = await addDoc(savedIssuesRef, newSavedIssue);
    return docRef.id;
  } catch (error) {
    console.error('Error adding saved issue:', error);
    throw error;
  }
};

// remove an issue from a user's saved issues
export const removeSavedIssue = async (userId, issueId) => {
  try {
    const savedIssuesRef = collection(db, `users/${userId}/savedIssues`);
    const q = query(savedIssuesRef, where('savedIssue', '==', `/issues/${issueId}`));

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error removing saved issue:', error);
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
      ...doc.data()
    }));

    return savedIssues;
  } catch (error) {
    console.error('Error retrieving saved issues:', error);
    throw error;
  }
};