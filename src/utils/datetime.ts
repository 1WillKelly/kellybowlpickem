export const currentSeasonYear = (): number => {
  const now = new Date();
  // If it's before October, assume we're talking about the previous year's
  // season
  if (now.getMonth() < 10) {
    return now.getFullYear() - 1;
  }
  return now.getFullYear();
};

export const seasonDisplayName = (): string => {
  const year = currentSeasonYear();
  return `${year}-${year + 1}`;
};
