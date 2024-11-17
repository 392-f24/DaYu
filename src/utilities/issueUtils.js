export const isIssueSavedByUser = (userId, issue) => {
  for (const userRef of issue.savedBy) {
    if (userId === userRef.id) {
      return true;
    }
  }
  return false;
};

// export const handleSavedToggle = (issue) => {
//     const isSaved = isIssueSavedByUser(userId, issue.id);
//     if (isSaved) {
//       addSavedIssue(userId, issue.id);
//     } else {
//       removeSavedIssue(userId, issue.id);
//     }
//     setIsSaved((prev) => !prev);
//   };
// }
