export const isIssueSavedByUser = (userId, issue) => {
  for (const userRef of issue.savedBy) {
    if (userId === userRef.id) {
      return true;
    }
  }
  return false;
};
