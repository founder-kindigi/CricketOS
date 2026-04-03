import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Player, Match, MatchFormat, Venue, TeamPreset, AppSettings } from '../types';

interface CricketState {
  initializeDefaults?: () => void;
  players: Player[];
  matches: Match[];
  venues: Venue[];
  teamPresets: TeamPreset[];
  settings: AppSettings;
  addPlayer: (name: string, aliases?: string[]) => Player;
  updatePlayer: (id: string, name: string, aliases: string[]) => void;
  deletePlayer: (id: string) => void;
  addMatch: (match: Omit<Match, 'id' | 'createdAt'>) => Match;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  getPlayerById: (id: string) => Player | undefined;
  getPlayerName: (id: string) => string;
  getPlayerStats: (playerId: string) => {
    matchesPlayed: number;
    winsAsCaptain: number;
    appearances: number;
    winsAsCaptainB: number;
    totalTeamWins: number;
  };
  getHeadToHead: (player1Id: string, player2Id: string) => { wins1: number; wins2: number; matches: number };
  toggleVenueFavorite: (venueId: string) => void;
  getVenueStats: (venueName: string) => { total: number; teamAWins: number; teamBWins: number };
  addTeamPreset: (preset: Omit<TeamPreset, 'id' | 'createdAt'>) => TeamPreset;
  updateTeamPreset: (id: string, preset: Partial<TeamPreset>) => void;
  deleteTeamPreset: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  exportData: () => string;
  importData: (data: string) => boolean;
}

const DEFAULT_PLAYERS: Omit<Player, 'id' | 'createdAt'>[] = [
  { name: 'Umar Khalid', aliases: ['Umar', 'Umar(c)', 'UMAR KHALID(C)', 'Umar Khalid(c)'], color: '#22c55e' },
  { name: 'Hussan Khalid', aliases: ['Hussan', 'Hassan', 'HUSSAN KHALID(C)', 'Hassan Khalid(c)', 'Hussan Khalid(c)'], color: '#3b82f6' },
  { name: 'Huzaifa Khawar', aliases: ['Huzaifa', 'HUZAIFA', 'Huzaifa khawar', 'HUZAIFA KHAWAR'], color: '#f59e0b' },
  { name: 'Ibrahim Khalid', aliases: ['Ibrahim', 'IBRAHIM', 'IBRAHIM KHALID', 'Ibrahim khalid'], color: '#ef4444' },
  { name: 'Zaid Khalid', aliases: ['Zaid', 'ZAID', 'ZAID KHALID', 'Zaid Bin Khalid', 'ZAID BIN KHALID'], color: '#8b5cf6' },
  { name: 'Muhammad Bin Qasim', aliases: ['MBQ', 'Muhammad Bin Qasim', 'MUHAMMAD BIN QASIM', 'Muhammad bin Qasim'], color: '#ec4899' },
  { name: 'Umar Bhai', aliases: ['BHAI UMAR', 'UMAR BHAI', 'Umar bhai'], color: '#06b6d4' },
  { name: 'Ali Bhai', aliases: ['BHAI ALI', 'ALI BHAI', 'Ali Bhai'], color: '#84cc16' },
  { name: 'Abubakar Bhai', aliases: ['ABUBKAR BHAI', 'ABUBKAR', 'ABUBAKAR BHAI', 'Abubakar Bhai', 'AbuBakar Bhai'], color: '#f97316' },
  { name: 'Ammar Bhai', aliases: ['AMMAR BHAI', 'Ammar Bhai'], color: '#14b8a6' },
  { name: 'Hamza Tariq', aliases: ['HAMZA', 'Hamza', 'HAMZA TARIQ', 'Hamza Tariq'], color: '#a855f7' },
  { name: 'Sultan', aliases: ['SULTAN', 'COUSIN_SULTAN', 'CZN', 'Sultan Bhai'], color: '#6366f1' },
  { name: 'Abdul Rehman', aliases: ['ABDUREHMAN', 'Abdul Rehman', 'ABDUL AL REHMAN', 'Abdul Al Rehman'], color: '#0ea5e9' },
];

export const useCricketStore = create<CricketState>()(
  persist(
    (set, get) => ({
      players: [],
      matches: [],
      venues: [],
      teamPresets: [],
      settings: {
        theme: 'dark',
        groupName: 'My Cricket Crew',
      },

      addPlayer: (name, aliases = []) => {
        const player: Player = {
          id: uuid(),
          name,
          aliases,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ players: [...state.players, player] }));
        return player;
      },

      updatePlayer: (id, name, aliases) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, name, aliases } : p
          ),
        }));
      },

      deletePlayer: (id) => {
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        }));
      },

      addMatch: (matchData) => {
        const match: Match = {
          ...matchData,
          id: uuid(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => {
          const newMatches = [match, ...state.matches];
          
          const venueIndex = state.venues.findIndex(
            (v) => v.name.toLowerCase() === match.location.toLowerCase()
          );
          
          let updatedVenues = state.venues;
          if (venueIndex >= 0) {
            updatedVenues = state.venues.map((v, i) =>
              i === venueIndex
                ? { ...v, matchCount: v.matchCount + 1, lastUsed: match.date }
                : v
            );
          } else {
            updatedVenues = [
              ...state.venues,
              {
                id: uuid(),
                name: match.location,
                matchCount: 1,
                lastUsed: match.date,
                isFavorite: false,
              },
            ];
          }
          
          return { matches: newMatches, venues: updatedVenues };
        });
        
        return match;
      },

      updateMatch: (id, updates) => {
        set((state) => ({
          matches: state.matches.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      deleteMatch: (id) => {
        set((state) => ({
          matches: state.matches.filter((m) => m.id !== id),
        }));
      },

      getPlayerById: (id) => {
        return get().players.find((p) => p.id === id);
      },

      getPlayerName: (id) => {
        const player = get().players.find((p) => p.id === id);
        return player?.name || 'Unknown Player';
      },

      getPlayerStats: (playerId) => {
        const matches = get().matches;
        const appearances = matches.filter((m) =>
          m.players.includes(playerId)
        ).length;
        
        const winsAsCaptain = matches.filter((m) => {
          return m.teamA.captain === playerId && m.result?.winner === 'A';
        }).length;

        const winsAsCaptainB = matches.filter((m) => {
          return m.teamB.captain === playerId && m.result?.winner === 'B';
        }).length;

        const totalTeamWins = matches.filter((m) => {
          const inTeamA = m.teamA.players.includes(playerId);
          const inTeamB = m.teamB.players.includes(playerId);
          if (inTeamA && m.result?.winner === 'A') return true;
          if (inTeamB && m.result?.winner === 'B') return true;
          return false;
        }).length;

        return { 
          matchesPlayed: appearances, 
          winsAsCaptain, 
          winsAsCaptainB,
          appearances, 
          totalTeamWins,
        };
      },

      getHeadToHead: (player1Id, player2Id) => {
        const matches = get().matches;
        const relevantMatches = matches.filter((m) => {
          const p1InA = m.teamA.players.includes(player1Id);
          const p1InB = m.teamB.players.includes(player1Id);
          const p2InA = m.teamA.players.includes(player2Id);
          const p2InB = m.teamB.players.includes(player2Id);
          return (p1InA && p2InB) || (p1InB && p2InA);
        });

        let wins1 = 0;
        let wins2 = 0;
        
        relevantMatches.forEach((m) => {
          if (m.result?.winner === 'A') {
            if (m.teamA.players.includes(player1Id)) wins1++;
            else wins2++;
          } else if (m.result?.winner === 'B') {
            if (m.teamB.players.includes(player1Id)) wins1++;
            else wins2++;
          }
        });

        return { wins1, wins2, matches: relevantMatches.length };
      },

      toggleVenueFavorite: (venueId) => {
        set((state) => ({
          venues: state.venues.map((v) =>
            v.id === venueId ? { ...v, isFavorite: !v.isFavorite } : v
          ),
        }));
      },

      getVenueStats: (venueName) => {
        const matches = get().matches.filter(
          (m) => m.location.toLowerCase() === venueName.toLowerCase()
        );
        return {
          total: matches.length,
          teamAWins: matches.filter((m) => m.result?.winner === 'A').length,
          teamBWins: matches.filter((m) => m.result?.winner === 'B').length,
        };
      },

      addTeamPreset: (preset) => {
        const newPreset: TeamPreset = {
          ...preset,
          id: uuid(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ teamPresets: [...state.teamPresets, newPreset] }));
        return newPreset;
      },

      updateTeamPreset: (id, preset) => {
        set((state) => ({
          teamPresets: state.teamPresets.map((p) =>
            p.id === id ? { ...p, ...preset } : p
          ),
        }));
      },

      deleteTeamPreset: (id) => {
        set((state) => ({
          teamPresets: state.teamPresets.filter((p) => p.id !== id),
        }));
      },

      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          players: state.players,
          matches: state.matches,
          venues: state.venues,
          teamPresets: state.teamPresets,
          settings: state.settings,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.players && parsed.matches) {
            set({
              players: parsed.players,
              matches: parsed.matches,
              venues: parsed.venues || [],
              teamPresets: parsed.teamPresets || [],
              settings: parsed.settings || get().settings,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      initializeDefaults: () => {
        const current = get().players;
        if (current.length === 0) {
          const defaultPlayers = DEFAULT_PLAYERS.map((p) => ({
            ...p,
            id: uuid(),
            createdAt: new Date().toISOString(),
          }));
          set({ players: defaultPlayers });
        }
      },
    }),
    {
      name: 'cricket-os-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.players.length === 0) {
          state.initializeDefaults?.();
        }
      },
    }
  )
);

export const formatLabels: Record<MatchFormat, string> = {
  team: 'Team Match',
  individual: 'Individual',
  series: 'Series',
  spt: 'Single Player Tournament',
};

export const PLAYER_COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16', '#f97316', '#14b8a6', '#a855f7', '#6366f1', '#0ea5e9',
];
