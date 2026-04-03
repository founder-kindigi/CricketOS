import type { Match, Player } from '../types';

const playerNameToId = (name: string, players: Player[]): string => {
  const normalized = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
  const player = players.find(p => {
    const pName = p.name.toLowerCase().replace(/\s+/g, '');
    const pAliases = p.aliases.map(a => a.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, ''));
    return pName.includes(normalized) || 
           pAliases.some(a => a.includes(normalized) || normalized.includes(a));
  });
  return player?.id || '';
};

export interface SeedMatchInput {
  date: string;
  location: string;
  day: string;
  time: string;
  format: Match['format'];
  teamAPlayers: string[];
  teamBPlayers: string[];
  teamACaptain: string;
  teamBCaptain: string;
  result?: { winner: 'A' | 'B' | 'draw'; score?: string };
  summary: string;
}

export const seedMatches: SeedMatchInput[] = [
  {
    date: '2024-05-11',
    location: 'AZEEM INDOOR CRICKET CLUB',
    day: 'Saturday',
    time: '7pm - 9pm',
    format: 'team',
    teamAPlayers: ['Umar Khalid', 'Huzaifa Khawar', 'Ibrahim Khalid'],
    teamBPlayers: ['Hussan Khalid', 'Muhammad Bin Qasim', 'Zaid Khalid'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    result: { winner: 'B', score: '3-2' },
    summary: 'Hamza on both sides.',
  },
  {
    date: '2024-10-18',
    location: 'Indoor Cricket',
    day: 'Friday',
    time: '',
    format: 'series',
    teamAPlayers: ['Umar Khalid', 'Huzaifa Khawar', 'Umar Bhai', 'Ibrahim Khalid'],
    teamBPlayers: ['Hussan Khalid', 'Zaid Khalid', 'Abubakar Bhai', 'Hamza Tariq'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    result: { winner: 'A', score: '3-2' },
    summary: 'Final match - Needed 34 runs. Two sixes by Umar Bhai to Zaid. 11 runs needed in final over - Hussan bowled and Umar did the rest.',
  },
  {
    date: '2025-01-11',
    location: 'Shapes Community Club, RG',
    day: 'Saturday',
    time: '7 - 10pm',
    format: 'team',
    teamAPlayers: ['Hussan Khalid', 'Huzaifa Khawar', 'Abdul Rehman', 'Umar Bhai', 'Hamza Tariq', 'Ammar Bhai'],
    teamBPlayers: ['Umar Khalid', 'Muhammad Bin Qasim', 'Sultan', 'Abubakar Bhai', 'Zaid Khalid', 'Ibrahim Khalid'],
    teamACaptain: 'Hussan Khalid',
    teamBCaptain: 'Umar Khalid',
    result: { winner: 'A', score: '4-2' },
    summary: '30 overs played in 6 matches per side.',
  },
  {
    date: '2025-01-25',
    location: 'Arena Sports Club, Saggian Road',
    day: 'Saturday',
    time: '8 - 10pm',
    format: 'team',
    teamAPlayers: ['Hussan Khalid', 'Muhammad Bin Qasim', 'Umar Bhai', 'Hamza Tariq', 'Zaid Khalid'],
    teamBPlayers: ['Umar Khalid', 'Huzaifa Khawar', 'Ali Bhai', 'Ammar Bhai', 'Ibrahim Khalid'],
    teamACaptain: 'Hussan Khalid',
    teamBCaptain: 'Umar Khalid',
    result: { winner: 'A', score: '3-1' },
    summary: '',
  },
  {
    date: '2025-02-22',
    location: 'Arena Sports Club, Saggian Road',
    day: 'Saturday',
    time: '8 - 10pm',
    format: 'team',
    teamAPlayers: ['Hussan Khalid', 'Muhammad Bin Qasim', 'Umar Bhai', 'Zaid Khalid', 'Ali Bhai'],
    teamBPlayers: ['Umar Khalid', 'Huzaifa Khawar', 'Abubakar Bhai', 'Ammar Bhai', 'Hamza Tariq'],
    teamACaptain: 'Hussan Khalid',
    teamBCaptain: 'Umar Khalid',
    result: { winner: 'A', score: '3-1' },
    summary: '',
  },
  {
    date: '2025-03-22',
    location: 'Indoor Cricket Near Rehman Garden Gate 3',
    day: 'Tuesday',
    time: '8 - 10pm',
    format: 'team',
    teamAPlayers: ['Umar Khalid', 'Muhammad Bin Qasim', 'Umar Bhai', 'Zaid Khalid', 'Ibrahim Khalid'],
    teamBPlayers: ['Hussan Khalid', 'Huzaifa Khawar', 'Ali Bhai', 'Ammar Bhai', 'Hamza Tariq'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    result: { winner: 'A', score: '3-1' },
    summary: 'Match 3 and 4 were tight till the last over.',
  },
  {
    date: '2025-06-21',
    location: 'Phool Mandi',
    day: 'Tuesday',
    time: '8 - 10pm',
    format: 'team',
    teamAPlayers: ['Umar Khalid', 'Huzaifa Khawar', 'Umar Bhai', 'Ibrahim Khalid', 'Ali Bhai'],
    teamBPlayers: ['Hussan Khalid', 'Zaid Khalid', 'Sultan', 'Abdul Rehman', 'Hamza Tariq', 'Muhammad Bin Qasim'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    result: { winner: 'A', score: '2-1' },
    summary: 'With Sultan, Abdul Rehman, and friends F1, F2.',
  },
  {
    date: '2025-08-23',
    location: 'Gulshan e Ravi, Indoor Roof Top',
    day: 'Friday',
    time: '8 - 9pm',
    format: 'team',
    teamAPlayers: ['Ibrahim Khalid', 'Umar Khalid'],
    teamBPlayers: ['Hussan Khalid', 'Huzaifa Khawar'],
    teamACaptain: 'Ibrahim Khalid',
    teamBCaptain: 'Hussan Khalid',
    summary: 'First time played at this venue. Small ground but enjoyed fast & furious cricket.',
  },
  {
    date: '2025-09-05',
    location: 'Gulshan e Ravi, Indoor Roof Top',
    day: 'Friday',
    time: '9 - 11pm',
    format: 'individual',
    teamAPlayers: ['Ibrahim Khalid', 'Umar Khalid', 'Hussan Khalid', 'Huzaifa Khawar'],
    teamBPlayers: [],
    teamACaptain: 'Ibrahim Khalid',
    teamBCaptain: 'Umar Khalid',
    summary: '6 individual matches. Huzaifa 4 won, Umar 1 won, Hussan 1 won, Ibrahim 0. Huzaifa scored 41 (highest).',
  },
  {
    date: '2025-09-14',
    location: 'Opposite to Risen Mall',
    day: 'Sunday',
    time: '6:30 - 7:30pm',
    format: 'individual',
    teamAPlayers: ['Ibrahim Khalid', 'Umar Khalid', 'Hussan Khalid', 'Huzaifa Khawar', 'Zaid Khalid', 'Muhammad Bin Qasim'],
    teamBPlayers: [],
    teamACaptain: 'Ibrahim Khalid',
    teamBCaptain: 'Umar Khalid',
    summary: '2 individual player matches. Huzaifa top in both matches.',
  },
  {
    date: '2025-09-19',
    location: 'Main Indoor, Saggian Road',
    day: 'Sunday',
    time: '7:50 - 8:50pm',
    format: 'team',
    teamAPlayers: ['Hussan Khalid', 'Zaid Khalid', 'Muhammad Bin Qasim'],
    teamBPlayers: ['Umar Khalid', 'Huzaifa Khawar', 'Ibrahim Khalid'],
    teamACaptain: 'Hussan Khalid',
    teamBCaptain: 'Umar Khalid',
    result: { winner: 'A', score: '2-0' },
    summary: 'IPM scores: Huzaifa 28, Umar 22, Ibrahim 16. Ibrahim hit 2 sixes to Hussan. Last match stopped due to bad light.',
  },
  {
    date: '2025-11-06',
    location: 'Indoor - KFC Top Roof',
    day: 'Thursday',
    time: '8:30pm - 9:30pm',
    format: 'series',
    teamAPlayers: ['Umar Khalid', 'Umar Bhai', 'Zaid Khalid'],
    teamBPlayers: ['Hussan Khalid', 'Huzaifa Khawar', 'Ibrahim Khalid'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    result: { winner: 'A', score: '3-2' },
    summary: 'Ibrahim hit six to Zaid. Umar Bhai exceptional knock in first 2 matches. Slow pitch. Umar played fantastic innings all matches.',
  },
  {
    date: '2025-12-17',
    location: 'Indoor - KFC Roof Top',
    day: 'Wednesday',
    time: '8:15pm - 9:15pm',
    format: 'team',
    teamAPlayers: ['Umar Khalid', 'Huzaifa Khawar', 'Hussan Khalid', 'Ibrahim Khalid'],
    teamBPlayers: [],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Huzaifa Khawar',
    summary: '3 individual matches (Hassan 2 won, Huzaifa 1). 3 team matches - Team A won all 3.',
  },
  {
    date: '2025-12-21',
    location: 'Indoor - Band Road, MCL Branch #2',
    day: 'Sunday',
    time: '4pm - 6pm',
    format: 'team',
    teamAPlayers: ['Umar Khalid', 'Umar Bhai', 'Ibrahim Khalid', 'Muhammad Bin Qasim'],
    teamBPlayers: ['Hussan Khalid', 'Abubakar Bhai', 'Hamza Tariq', 'Huzaifa Khawar'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    summary: '6 matches played. Team B won first 2. After swapping captains, Team B won 1 more, Team A won next 3. Hassan won 4, Umar won 2 as captains.',
  },
  {
    date: '2026-02-13',
    location: 'Indoor - Band Road, MCL Branch #2',
    day: 'Friday',
    time: '8:30pm - 9:30pm',
    format: 'team',
    teamAPlayers: ['Umar Khalid', 'Zaid Khalid'],
    teamBPlayers: ['Hussan Khalid', 'Huzaifa Khawar'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    summary: 'Huzaifa won single player tournament. 2 team matches played, 1 for each team. 3rd match not completed.',
  },
  {
    date: '2026-02-16',
    location: 'Indoor - Near Samnabad Under Pass',
    day: 'Monday',
    time: '8:40pm - 9:40pm',
    format: 'spt',
    teamAPlayers: ['Umar Khalid', 'Zaid Khalid'],
    teamBPlayers: ['Hussan Khalid', 'Huzaifa Khawar'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    result: { winner: 'draw', score: '2-2' },
    summary: '2 SPT matches, 4 team matches. SPT 1 drawn between Hassan & Huzaifa. Hassan won SPT 2. Series level 2-2. Umar smash maximums.',
  },
  {
    date: '2026-02-27',
    location: 'Indoor - Band Road, MCL Branch #2',
    day: 'Friday',
    time: '8:15pm - 9:15pm',
    format: 'individual',
    teamAPlayers: ['Umar Khalid', 'Hussan Khalid', 'Huzaifa Khawar'],
    teamBPlayers: [],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    summary: '4 SPT matches. Huzaifa 3 won, Umar 1 won, Hassan 0. Hassan took one-handed blinder at boundary. Burger party after.',
  },
  {
    date: '2026-03-11',
    location: 'Roof Top Near KFC Gulshan Ravi',
    day: 'Wednesday',
    time: '9pm - 11pm',
    format: 'team',
    teamAPlayers: ['Umar Khalid', 'Zaid Khalid', 'Ibrahim Khalid', 'Umar Bhai'],
    teamBPlayers: ['Hussan Khalid', 'Huzaifa Khawar', 'Abubakar Bhai', 'Hamza Tariq'],
    teamACaptain: 'Umar Khalid',
    teamBCaptain: 'Hussan Khalid',
    result: { winner: 'A', score: '4-2' },
    summary: '6 team matches. After 2 matches equal, teams changed. Captain Umar won 4, Captain Hassan won 2. Spin track, conditions tough. Cheezious party after.',
  },
];

export function createMatchesFromSeed(players: Player[]): Omit<Match, 'id' | 'createdAt'>[] {
  return seedMatches.map(seed => {
    const teamAIds = seed.teamAPlayers.map(name => playerNameToId(name, players)).filter(Boolean);
    const teamBIds = seed.teamBPlayers.map(name => playerNameToId(name, players)).filter(Boolean);
    const teamACaptainId = playerNameToId(seed.teamACaptain, players) || teamAIds[0] || '';
    const teamBCaptainId = playerNameToId(seed.teamBCaptain, players) || teamBIds[0] || '';
    
    return {
      date: seed.date,
      location: seed.location,
      day: seed.day,
      time: seed.time,
      format: seed.format,
      players: [...teamAIds, ...teamBIds],
      teamA: {
        players: teamAIds,
        captain: teamACaptainId,
      },
      teamB: {
        players: teamBIds,
        captain: teamBCaptainId,
      },
      result: seed.result,
      summary: seed.summary,
    };
  });
}
