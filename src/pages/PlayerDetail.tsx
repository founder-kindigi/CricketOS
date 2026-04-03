import { useParams, Link } from 'react-router-dom';
import { useCricketStore } from '../store/cricketStore';
import { ChevronLeft, TrendingUp, User, Swords, Calendar, Crown, Target } from 'lucide-react';

const PLAYER_AVATARS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-orange-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const { players, getPlayerStats, getHeadToHead, matches } = useCricketStore();
  
  const player = players.find((p) => p.id === id);
  const playerIndex = players.findIndex((p) => p.id === id);
  
  if (!player) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-slate-600" />
        </div>
        <p className="text-slate-400 mb-4">Player not found</p>
        <Link to="/players" className="text-emerald-400 hover:text-emerald-300">
          Back to Players
        </Link>
      </div>
    );
  }

  const stats = getPlayerStats(player.id);
  const totalCaptainWins = stats.winsAsCaptain + stats.winsAsCaptainB;
  const recentMatches = matches
    .filter((m) => m.players.includes(player.id))
    .slice(0, 5);

  const otherPlayers = players.filter((p) => p.id !== player.id);
  const h2hPlayers = otherPlayers
    .map((other) => ({
      ...other,
      h2h: getHeadToHead(player.id, other.id),
    }))
    .filter((p) => p.h2h.matches > 0)
    .sort((a, b) => b.h2h.matches - a.h2h.matches);

  const avatarColor = PLAYER_AVATARS[playerIndex % PLAYER_AVATARS.length];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/players" className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Player Profile</h1>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center">
        <div className={`w-24 h-24 rounded-2xl ${avatarColor} flex items-center justify-center mx-auto mb-4 text-white font-bold text-3xl shadow-xl`}>
          {getInitials(player.name)}
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-1">{player.name}</h2>
        {player.aliases.length > 0 && (
          <p className="text-slate-400 text-sm">
            Also known as: {player.aliases.join(', ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-amber-500/15 to-amber-600/5 rounded-2xl p-4 border border-amber-500/20 text-center">
          <Crown className="mx-auto mb-2 text-amber-400" size={22} />
          <p className="text-3xl font-bold text-amber-400">{totalCaptainWins}</p>
          <p className="text-[10px] text-slate-400 mt-1">Captain Wins</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 rounded-2xl p-4 border border-emerald-500/20 text-center">
          <Target className="mx-auto mb-2 text-emerald-400" size={22} />
          <p className="text-3xl font-bold text-emerald-400">{stats.appearances}</p>
          <p className="text-[10px] text-slate-400 mt-1">Matches</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/15 to-blue-600/5 rounded-2xl p-4 border border-blue-500/20 text-center">
          <TrendingUp className="mx-auto mb-2 text-blue-400" size={22} />
          <p className="text-3xl font-bold text-blue-400">{stats.totalTeamWins}</p>
          <p className="text-[10px] text-slate-400 mt-1">Team Wins</p>
        </div>
      </div>

      {h2hPlayers.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Swords size={18} className="text-purple-400" />
            Head to Head
          </h3>
          <div className="space-y-2">
            {h2hPlayers.slice(0, 6).map((other, i) => (
              <div
                key={other.id}
                className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-medium text-purple-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-200 text-sm">{other.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">{other.h2h.wins1}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-blue-400 font-bold">{other.h2h.wins2}</span>
                  <span className="text-slate-500 text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                    {other.h2h.matches}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentMatches.length > 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" />
            Recent Matches
          </h3>
          <div className="space-y-2">
            {recentMatches.map((match) => {
              const inTeamA = match.teamA.players.includes(player.id);
              const won = (inTeamA && match.result?.winner === 'A') || 
                         (!inTeamA && match.result?.winner === 'B');
              
              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-700/30 transition-colors"
                >
                  <div>
                    <p className="text-slate-200 text-sm">{match.location}</p>
                    <p className="text-slate-500 text-xs">{new Date(match.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    match.result?.winner === 'draw' 
                      ? 'bg-purple-500/20 text-purple-400'
                      : won 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-700 text-slate-400'
                  }`}>
                    {match.result?.winner === 'draw' ? 'Draw' : won ? 'Won' : 'Lost'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
