export interface Player {
  id: string;
  name: string;
  aliases: string[];
  createdAt: string;
  color?: string;
}

export interface Team {
  players: string[];
  captain: string;
}

export interface MatchResult {
  winner: 'A' | 'B' | 'draw';
  score?: string;
}

export type MatchFormat = 'team' | 'individual' | 'series' | 'spt';

export interface Match {
  id: string;
  date: string;
  location: string;
  day: string;
  time: string;
  format: MatchFormat;
  players: string[];
  teamA: Team;
  teamB: Team;
  result?: MatchResult;
  summary: string;
  createdAt: string;
  createdBy?: string;
  rating?: number;
  tags?: string[];
}

export interface Venue {
  id: string;
  name: string;
  matchCount: number;
  lastUsed: string;
  isFavorite: boolean;
}

export interface TeamPreset {
  id: string;
  name: string;
  players: string[];
  captain: string;
  createdAt: string;
}

export interface GroupSettings {
  name: string;
  logo?: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  groupName: string;
}
