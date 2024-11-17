// maybe change in the future
export const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });