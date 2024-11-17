import { formatDistanceToNow, isToday } from "date-fns";

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);

  // Check if the date is today
  if (isToday(date)) {
    // Show relative time (e.g., "2 hours ago")
    return `${formatDistanceToNow(date, { addSuffix: true })}`;
  }

  // Show full date and time for non-today dates
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
