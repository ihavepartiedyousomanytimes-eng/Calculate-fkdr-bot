export function calculateFKDR(finalKills, finalDeaths) {
  if (finalDeaths === 0) return finalKills;
  return finalKills / finalDeaths;
}

export function finalsNeededForGoal(finalKills, finalDeaths, goal) {
  if (finalDeaths === 0) return 0;
  const needed = Math.ceil(goal * finalDeaths - finalKills);
  return Math.max(0, needed);
}
