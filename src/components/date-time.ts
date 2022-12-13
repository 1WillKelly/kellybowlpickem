export const formatTime = (date: Date): string => {
  return date
    .toLocaleTimeString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .replace(":00 ", " ");
};
