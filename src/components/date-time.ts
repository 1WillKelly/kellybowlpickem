export const formatTime = (date: Date): string => {
  return (
    date
      .toLocaleTimeString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .replace(":00 ", " ")
      // Desktop
      .replace(/([0-9]), /, "$1 - ")
      // Mobile Safari
      .replace(" at ", " - ")
  );
};
