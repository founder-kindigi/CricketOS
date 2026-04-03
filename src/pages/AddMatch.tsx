import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCricketStore } from '../store/cricketStore';
import { formatInputDate } from '../utils/date';
import type { MatchFormat, MatchResult } from '../types';
import { ChevronLeft } from 'lucide-react';

export function AddMatch() {
  const navigate = useNavigate();
  const { addMatch, getPlayerById } = useCricketStore();

  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(formatInputDate(new Date()));
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [format, setFormat] = useState<MatchFormat>('team');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [teamA, setTeamA] = useState<{ captain: string; players: string[] }>({
    captain: '',
    players: [],
  });
  const [teamB, setTeamB] = useState<{ captain: string; players: string[] }>({
    captain: '',
    players: [],
  });
  const [result, setResult] = useState<MatchResult>({ winner: undefined as any, score: '' });
  const [summary, setSummary] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];



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
    setSelectedPlayers(prev => prev.filter(id => id !== playerId));
  };



  const setCaptain = (team: 'A' | 'B', playerId: string) => {
    if (team === 'A') {
      setTeamA({ ...teamA, captain: playerId });
    } else {
      setTeamB({ ...teamB, captain: playerId });
    }
  };

  const handleSubmit = () => {
    const allPlayers = [
      ...selectedPlayers,
      ...teamA.players,
      ...teamB.players,
    ];

    addMatch({
      location,
      date,
      day,
      time,
      format,
      players: allPlayers,
      teamA,
      teamB,
      result: result.winner ? result : undefined,
      summary,
    });

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
          Select {format === 'team' ? 'players for teams' : 'participating players'}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-xs text-emerald-400 font-medium mb-2">Team A</p>
            <p className="text-sm font-medium text-slate-200">
              {teamA.players.length > 0
                ? teamA.players.map(id => getPlayerById(id)?.name.split(' ')[0]).join(', ')
                : 'None selected'}
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-400 font-medium mb-2">Team B</p>
            <p className="text-sm font-medium text-slate-200">
              {teamB.players.length > 0
                ? teamB.players.map(id => getPlayerById(id)?.name.split(' ')[0]).join(', ')
                : 'None selected'}
            </p>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {selectedPlayers.map((playerId) => {
            const player = getPlayerById(playerId);
            if (!player) return null;
            
            return (
              <div key={playerId} className="flex items-center gap-2">
                <button
                  onClick={() => addToTeam('A', playerId)}
                  className="flex-1 bg-slate-800 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 py-2 px-3 rounded-lg text-sm text-left transition-colors"
                >
                  {player.name}
                </button>
                <button
                  onClick={() => addToTeam('B', playerId)}
                  className="flex-1 bg-slate-800 hover:bg-blue-500/20 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-blue-400 py-2 px-3 rounded-lg text-sm text-left transition-colors"
                >
                  {player.name}
                </button>
              </div>
            );
          })}
        </div>
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
              onClick={() => setResult({ ...result, winner: w })}
              className={`py-3 rounded-lg border text-sm font-medium transition-colors ${
                result.winner === w
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
        {result.winner !== 'draw' && (
          <input
            type="text"
            value={result.score}
            onChange={(e) => setResult({ ...result, score: e.target.value })}
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
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Save Match
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Add Match</h1>
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
