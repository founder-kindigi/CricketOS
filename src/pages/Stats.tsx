import { Trophy, Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { useCricketStore, formatLabels } from '../store/cricketStore';

export function Stats() {
  const { matches, players, getPlayerStats } = useCricketStore();

  const formatStats = matches.reduce((acc, m) => {
    acc[m.format] = (acc[m.format] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const venueStats = matches.reduce((acc, m) => {
    acc[m.location] = (acc[m.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedVenues = Object.entries(venueStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const playerStats = players
    .map((p) => ({
      ...getPlayerStats(p.id),
      player: p,
    }))
    .filter((p) => p.appearances > 0)
    .sort((a, b) => b.appearances - a.appearances);

  const captainWins = players
    .map((p) => ({
      ...getPlayerStats(p.id),
      player: p,
    }))
    .filter((p) => p.winsAsCaptain > 0)
    .sort((a, b) => b.winsAsCaptain - a.winsAsCaptain);

  const totalWinsA = matches.filter((m) => m.result?.winner === 'A').length;
  const totalWinsB = matches.filter((m) => m.result?.winner === 'B').length;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Statistics</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Trophy size={18} />
            <span className="text-sm font-medium">Team A</span>
          </div>
          <p className="text-3xl font-bold">{totalWinsA}</p>
          <p className="text-xs text-slate-400">wins</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Trophy size={18} />
            <span className="text-sm font-medium">Team B</span>
          </div>
          <p className="text-3xl font-bold">{totalWinsB}</p>
          <p className="text-xs text-slate-400">wins</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-purple-400" />
          <h3 className="font-semibold">Format Breakdown</h3>
        </div>
        <div className="space-y-2">
          {Object.entries(formatStats).map(([format, count]) => (
            <div
              key={format}
              className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
            >
              <span className="text-slate-300">{formatLabels[format as keyof typeof formatLabels]}</span>
              <span className="font-medium text-slate-100">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-orange-400" />
          <h3 className="font-semibold">Top Venues</h3>
        </div>
        {sortedVenues.length > 0 ? (
          <div className="space-y-2">
            {sortedVenues.map(([venue, count], i) => (
              <div
                key={venue}
                className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 text-sm truncate max-w-[180px]">{venue}</span>
                </div>
                <span className="font-medium text-slate-100">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No venue data yet</p>
        )}
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-emerald-400" />
          <h3 className="font-semibold">Most Active Players</h3>
        </div>
        {playerStats.length > 0 ? (
          <div className="space-y-2">
            {playerStats.slice(0, 5).map((p, i) => (
              <div
                key={p.player.id}
                className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-medium text-emerald-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 text-sm">{p.player.name}</span>
                </div>
                <span className="font-medium text-slate-100">{p.appearances}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No match data yet</p>
        )}
      </div>

      {captainWins.length > 0 && (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-yellow-400" />
            <h3 className="font-semibold">Captain Wins</h3>
          </div>
          <div className="space-y-2">
            {captainWins.map((p, i) => (
              <div
                key={p.player.id}
                className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-xs font-medium text-yellow-400">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 text-sm">{p.player.name}</span>
                </div>
                <span className="font-medium text-yellow-400">{p.winsAsCaptain}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
