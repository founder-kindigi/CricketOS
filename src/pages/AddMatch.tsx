import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCricketStore } from '../store/cricketStore';
import { formatInputDate } from '../utils/date';
import type { MatchFormat, MatchResult, Player } from '../types';
import { ChevronLeft, X } from 'lucide-react';

export function AddMatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches, players, addMatch, updateMatch, getPlayerById } = useCricketStore();
  
  const existingMatch = id ? matches.find(m => m.id === id) : null;
  const isEditMode = !!existingMatch;

  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(existingMatch?.location || '');
  const [date, setDate] = useState(existingMatch?.date || formatInputDate(new Date()));
  const [day, setDay] = useState(existingMatch?.day || '');
  const [time, setTime] = useState(existingMatch?.time || '');
  const [format, setFormat] = useState<MatchFormat>(existingMatch?.format || 'team');
  const [teamA, setTeamA] = useState(existingMatch?.teamA || { captain: '', players: [] });
  const [teamB, setTeamB] = useState(existingMatch?.teamB || { captain: '', players: [] });
  const [result, setResult] = useState<MatchResult | null>(existingMatch?.result || null);
  const [summary, setSummary] = useState(existingMatch?.summary || '');

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const allMatchPlayers = useMemo(() => {
    return existingMatch 
      ? [...existingMatch.teamA.players, ...existingMatch.teamB.players]
      : [];
  }, [existingMatch]);

  const availablePlayers = useMemo(() => {
    return allMatchPlayers.length > 0
      ? players.filter(p => !allMatchPlayers.includes(p.id))
      : players;
  }, [players, allMatchPlayers]);

  const removeFromTeam = (team: 'A' | 'B', playerId: string) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    
    const newPlayers = current.players.filter(pid => pid !== playerId);
    setter({
      players: newPlayers,
      captain: current.captain === playerId ? (newPlayers[0] || '') : current.captain,
    });
  };

  const addToTeam = (team: 'A' | 'B', playerId: string) => {
    const setter = team === 'A' ? setTeamA : setTeamB;
    const current = team === 'A' ? teamA : teamB;
    
    if (!current.players.includes(playerId)) {
      setter({
        ...current,
        players: [...current.players, playerId],
        captain: current.captain || playerId,
      });
    }
  };

  const setCaptain = (team: 'A' | 'B', playerId: string) => {
    if (team === 'A') {
      setTeamA({ ...teamA, captain: playerId });
    } else {
      setTeamB({ ...teamB, captain: playerId });
    }
  };

  const handleSubmit = () => {
    const teamAPlayers = teamA.players.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[];
    const teamBPlayers = teamB.players.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[];
    const allPlayers = [...availablePlayers, ...teamAPlayers, ...teamBPlayers];

    const matchData = {
      location,
      date,
      day,
      time,
      format,
      players: allPlayers.map(p => p.id),
      teamA,
      teamB,
      result: result || undefined,
      summary,
    };

    if (isEditMode && id) {
      updateMatch(id, matchData);
    } else {
      addMatch(matchData);
    }

    navigate('/');
  };

  const updateDay = (dateStr: string) => {
    setDate(dateStr);
    const d = new Date(dateStr);
    setDay(days[d.getDay()]);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Arena Sports Club, Saggian Road"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => updateDay(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Day
          </label>
          <input
            type="text"
            value={day}
            readOnly
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-slate-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Time
        </label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g., 8 - 10pm"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Format
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['team', 'individual', 'series', 'spt'] as MatchFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                format === f
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              {f === 'team' && 'Team Match'}
              {f === 'individual' && 'Individual'}
              {f === 'series' && 'Series'}
              {f === 'spt' && 'SPT'}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!location || !date || !time}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors mt-4"
      >
        Next: Select Players
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-400 mb-3">
          Tap to add players to teams
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-xs text-emerald-400 font-medium mb-2">Team A</p>
            <div className="space-y-1">
              {teamA.players.map((playerId) => {
                const player = getPlayerById(playerId);
                return (
                  <div key={playerId} className="flex items-center justify-between">
                    <span className="text-sm text-slate-200 truncate">
                      {player?.name?.split(' ')[0]} {teamA.captain === playerId && '(c)'}
                    </span>
                    <button
                      onClick={() => removeFromTeam('A', playerId)}
                      className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
              {teamA.players.length === 0 && (
                <span className="text-xs text-slate-500">Tap players below</span>
              )}
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-400 font-medium mb-2">Team B</p>
            <div className="space-y-1">
              {teamB.players.map((playerId) => {
                const player = getPlayerById(playerId);
                return (
                  <div key={playerId} className="flex items-center justify-between">
                    <span className="text-sm text-slate-200 truncate">
                      {player?.name?.split(' ')[0]} {teamB.captain === playerId && '(c)'}
                    </span>
                    <button
                      onClick={() => removeFromTeam('B', playerId)}
                      className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
              {teamB.players.length === 0 && (
                <span className="text-xs text-slate-500">Tap players below</span>
              )}
            </div>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {availablePlayers.map((player) => {
            return (
              <div key={player.id} className="flex items-center gap-2">
                <button
                  onClick={() => addToTeam('A', player.id)}
                  className="flex-1 bg-slate-800 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 py-2 px-3 rounded-lg text-sm text-left transition-colors"
                >
                  {player.name}
                </button>
                <button
                  onClick={() => addToTeam('B', player.id)}
                  className="flex-1 bg-slate-800 hover:bg-blue-500/20 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-blue-400 py-2 px-3 rounded-lg text-sm text-left transition-colors"
                >
                  {player.name}
                </button>
              </div>
            );
          })}
        </div>

        {availablePlayers.length === 0 && teamA.players.length === 0 && teamB.players.length === 0 && (
          <p className="text-center text-slate-500 text-sm py-4">
            No players available. Add players first.
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setStep(1)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={teamA.players.length === 0 || teamB.players.length === 0}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
        >
          Next: Result
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Select Captains
        </label>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-emerald-400 font-medium mb-2">Team A Captain</p>
            <div className="space-y-1">
              {teamA.players.map((playerId) => {
                const player = getPlayerById(playerId);
                return (
                  <button
                    key={playerId}
                    onClick={() => setCaptain('A', playerId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      teamA.captain === playerId
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {player?.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs text-blue-400 font-medium mb-2">Team B Captain</p>
            <div className="space-y-1">
              {teamB.players.map((playerId) => {
                const player = getPlayerById(playerId);
                return (
                  <button
                    key={playerId}
                    onClick={() => setCaptain('B', playerId)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      teamB.captain === playerId
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {player?.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Match Result
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {(['A', 'B', 'draw'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setResult({ winner: w, score: result?.score || '' })}
              className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                result?.winner === w
                  ? w === 'A'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : w === 'B'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : 'bg-purple-500/20 border-purple-500 text-purple-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {w === 'A' ? 'Team A' : w === 'B' ? 'Team B' : 'Draw'}
            </button>
          ))}
        </div>
        {result?.winner && result.winner !== 'draw' && (
          <input
            type="text"
            value={result.score || ''}
            onChange={(e) => setResult({ winner: result?.winner || 'A', score: e.target.value })}
            placeholder="Score (e.g., 3-2)"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Summary (optional)
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Match highlights, notable performances..."
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!teamA.captain || !teamB.captain}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
        >
          {isEditMode ? 'Update Match' : 'Save Match'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{isEditMode ? 'Edit Match' : 'Add Match'}</h1>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              step >= s ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
