import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCricketStore } from '../store/cricketStore';
import { formatInputDate } from '../utils/date';
import { ChevronLeft, Zap, MapPin, Clock, RotateCcw } from 'lucide-react';

export function QuickMatch() {
  const navigate = useNavigate();
  const { players, matches, addMatch, getPlayerById, settings } = useCricketStore();

  const [, setSelectedPlayers] = useState<string[]>([]);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [result, setResult] = useState<'A' | 'B' | 'draw' | null>(null);
  const [location, setLocation] = useState(settings.lastVenue || '');
  const [time, setTime] = useState('');

  const recentMatch = matches[0];

  const getLastMatchTeams = () => {
    if (!recentMatch) return { teamA: [], teamB: [] };
    return {
      teamA: recentMatch.teamA.players,
      teamB: recentMatch.teamB.players,
    };
  };

  const lastMatchTeams = getLastMatchTeams();

  const swapTeams = () => {
    const newA = teamB;
    const newB = teamA;
    setTeamA(newA);
    setTeamB(newB);
  };

  const loadLastMatch = () => {
    setTeamA(lastMatchTeams.teamA);
    setTeamB(lastMatchTeams.teamB);
    setSelectedPlayers([]);
    setLocation(recentMatch?.location || '');
    setTime(recentMatch?.time || '');
  };

  const loadLastMatchSwapped = () => {
    setTeamA(lastMatchTeams.teamB);
    setTeamB(lastMatchTeams.teamA);
    setSelectedPlayers([]);
    setLocation(recentMatch?.location || '');
    setTime(recentMatch?.time || '');
  };

  const addToTeamA = (playerId: string) => {
    if (!teamA.includes(playerId)) {
      setTeamA(prev => [...prev, playerId]);
      setTeamB(prev => prev.filter(id => id !== playerId));
      setSelectedPlayers(prev => prev.filter(id => id !== playerId));
    }
  };

  const addToTeamB = (playerId: string) => {
    if (!teamB.includes(playerId)) {
      setTeamB(prev => [...prev, playerId]);
      setTeamA(prev => prev.filter(id => id !== playerId));
      setSelectedPlayers(prev => prev.filter(id => id !== playerId));
    }
  };

  const removeFromTeam = (team: 'A' | 'B', playerId: string) => {
    if (team === 'A') {
      setTeamA(prev => prev.filter(id => id !== playerId));
    } else {
      setTeamB(prev => prev.filter(id => id !== playerId));
    }
    setSelectedPlayers(prev => [...prev, playerId]);
  };

  const handleSubmit = () => {
    if (teamA.length === 0 || teamB.length === 0) return;

    const captainA = teamA[0];
    const captainB = teamB[0];

    addMatch({
      location,
      date: formatInputDate(new Date()),
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
      time,
      format: 'team',
      players: [...teamA, ...teamB],
      teamA: { players: teamA, captain: captainA },
      teamB: { players: teamB, captain: captainB },
      result: result ? { winner: result } : undefined,
      summary: '',
      isQuickMatch: true,
    });

    navigate('/');
  };

  const availablePlayers = players.filter(
    p => !teamA.includes(p.id) && !teamB.includes(p.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Zap size={24} className="text-amber-400" />
          <h1 className="text-xl font-bold">Quick Match</h1>
        </div>
        {recentMatch && (
          <button
            onClick={loadLastMatchSwapped}
            className="ml-auto flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors"
            title="Swap & Load last match"
          >
            <RotateCcw size={12} />
            Swap
          </button>
        )}
      </div>

      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-4 border border-amber-500/20">
        <div className="flex items-center gap-3 mb-3">
          <MapPin size={16} className="text-amber-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Venue (auto-filled)"
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
          />
          <Clock size={14} className="text-slate-400" />
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Time"
            className="w-24 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm text-right"
          />
        </div>
        {recentMatch && (
          <button
            onClick={loadLastMatch}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <RotateCcw size={12} />
            Load last match teams
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-500/10 rounded-2xl p-3 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-400 font-semibold">Team A</span>
            <button onClick={swapTeams} className="text-xs text-slate-500 hover:text-slate-300">
              <RotateCcw size={12} />
            </button>
          </div>
          <div className="space-y-1 min-h-[80px]">
            {teamA.map(id => {
              const p = getPlayerById(id);
              return (
                <div
                  key={id}
                  onClick={() => removeFromTeam('A', id)}
                  className="flex items-center justify-between py-1.5 px-2 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors group"
                >
                  <span className="text-sm text-slate-200 truncate">{p?.name?.split(' ')[0]}</span>
                  <span className="text-xs text-slate-500 group-hover:text-red-400">×</span>
                </div>
              );
            })}
            {teamA.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">Tap players →</p>
            )}
          </div>
        </div>

        <div className="bg-blue-500/10 rounded-2xl p-3 border border-blue-500/20">
          <span className="text-xs text-blue-400 font-semibold">Team B</span>
          <div className="space-y-1 min-h-[80px] mt-2">
            {teamB.map(id => {
              const p = getPlayerById(id);
              return (
                <div
                  key={id}
                  onClick={() => removeFromTeam('B', id)}
                  className="flex items-center justify-between py-1.5 px-2 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors group"
                >
                  <span className="text-sm text-slate-200 truncate">{p?.name?.split(' ')[0]}</span>
                  <span className="text-xs text-slate-500 group-hover:text-red-400">×</span>
                </div>
              );
            })}
            {teamB.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">← Tap players</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/50">
        <p className="text-xs text-slate-400 mb-2 text-center">Tap to add:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {availablePlayers.map(p => (
            <button
              key={p.id}
              onClick={() => teamA.length <= teamB.length ? addToTeamA(p.id) : addToTeamB(p.id)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-emerald-500/20 hover:border-emerald-500/30 border border-slate-600 rounded-lg text-sm text-slate-300 transition-colors"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
          {availablePlayers.length === 0 && (
            <p className="text-xs text-slate-500 py-2">All players assigned</p>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <p className="text-sm text-slate-300 mb-3 text-center">Who won?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setResult('A')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              result === 'A'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-emerald-500/20'
            }`}
          >
            Team A
          </button>
          <button
            onClick={() => setResult('draw')}
            className={`px-4 py-3 rounded-xl font-semibold transition-all ${
              result === 'draw'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-purple-500/20'
            }`}
          >
            Draw
          </button>
          <button
            onClick={() => setResult('B')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              result === 'B'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-blue-500/20'
            }`}
          >
            Team B
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={teamA.length === 0 || teamB.length === 0}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
      >
        Save Match
      </button>
    </div>
  );
}
