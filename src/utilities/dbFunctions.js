// dbFunctions.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Add a new issue -- TESTED
export const addIssue = async (issue) => {
  try {
    const docRef = await addDoc(collection(db, 'issues'), issue);
    return docRef.id;
  } catch (error) {
    console.error('Error adding issue: ', error);
    throw error;
  }
};

// Fetch all issues -- UNTESTED
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

// Update an issue -- UNTESTED
export const updateIssue = async (id, updates) => {
  try {
    const issueRef = doc(db, 'issues', id);
    await updateDoc(issueRef, updates);
  } catch (error) {
    console.error('Error updating issue: ', error);
    throw error;
  }
};

// Delete an issue -- UNTESTED
export const deleteIssue = async (id) => {
  try {
    await deleteDoc(doc(db, 'issues', id));
  } catch (error) {
    console.error('Error deleting issue: ', error);
    throw error;
  }
};