export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startDate: string; // ISO string
  venue?: string;
  competition?: string;
  preview?: string;
};

// Small utility to generate a list of upcoming sample matches.
// This lives server-side and can be replaced with a real data fetch
// (e.g. from an external football API) later.
export async function getUpcomingMatches(count = 6): Promise<Match[]> {
  const teams = [
    'Brighton', 'Man City', 'Nottm Forest', 'West Ham', 'Liverpool', 'Arsenal',
    'Aston Villa', 'Crystal Palace', 'Bournemouth', 'Chelsea', 'Tottenham', 'Leeds'
  ];

  const hours = [9, 11, 14, 16, 19, 20];
  const now = new Date();
  const result: Match[] = [];

  // deterministic pseudo-random pairing using index
  for (let i = 0; i < count; i++) {
    const home = teams[(i * 2) % teams.length];
    const away = teams[(i * 2 + 1) % teams.length];

    const d = new Date(now);
    d.setDate(now.getDate() + (i + 1));
    d.setHours(hours[i % hours.length], 0, 0, 0);

    result.push({
      id: `match-${d.toISOString()}`,
      homeTeam: home,
      awayTeam: away,
      startDate: d.toISOString(),
      venue: 'Old Crown Screen',
      competition: 'Premier League',
      preview: '',
    });
  }

  return result;
}
