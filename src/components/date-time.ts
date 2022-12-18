export const formatTime = (date: Date): string => {
  return date
    .toLocaleTimeString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .replace(":00 ", " ")
    .replace(new RegExp("[0-9], ", "g"), " - ");
};
