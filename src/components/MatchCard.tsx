import { Link } from 'react-router-dom';
import { format } from '../utils/date';
import { useCricketStore, formatLabels } from '../store/cricketStore';
import type { Match } from '../types';
import { MapPin, Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  showLink?: boolean;
}

export function MatchCard({ match, showLink = true }: MatchCardProps) {
  const { getPlayerName } = useCricketStore();

  const cardContent = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Calendar size={14} />
          <span>{format(match.date)}</span>
          <span className="text-slate-600">|</span>
          <span>{match.day}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-slate-300">
            {formatLabels[match.format]}
          </span>
          {showLink && <ChevronRight size={16} className="text-slate-500" />}
        </div>
      </div>

      <div className="flex items-start gap-2 mb-2 text-slate-400 text-sm">
        <MapPin size={14} className="mt-0.5 flex-shrink-0" />
        <span className="line-clamp-1">{match.location}</span>
      </div>

      <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
        <Clock size={14} />
        <span>{match.time}</span>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-3 mb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs mb-1">Team A</span>
            <span className="font-medium text-slate-200">
              {getPlayerName(match.teamA.captain)} (c)
            </span>
            <span className="text-slate-400 text-xs">
              {match.teamA.players.filter(id => id !== match.teamA.captain).map(getPlayerName).join(', ')}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-slate-400 text-xs mb-1">Team B</span>
            <span className="font-medium text-slate-200">
              {getPlayerName(match.teamB.captain)} (c)
            </span>
            <span className="text-slate-400 text-xs">
              {match.teamB.players.filter(id => id !== match.teamB.captain).map(getPlayerName).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {match.result && (
        <div className={`flex items-center gap-2 ${match.result.winner === 'draw' ? 'text-slate-400' : match.result.winner === 'A' ? 'text-emerald-400' : 'text-blue-400'}`}>
          <Trophy size={16} />
          <span className="font-medium">
            {match.result.winner === 'A' && `Team A wins${match.result.score ? ` (${match.result.score})` : ''}`}
            {match.result.winner === 'B' && `Team B wins${match.result.score ? ` (${match.result.score})` : ''}`}
            {match.result.winner === 'draw' && 'Match Draw'}
          </span>
        </div>
      )}

      {match.summary && (
        <p className="mt-3 text-sm text-slate-400 italic border-t border-slate-700 pt-3 line-clamp-2">
          {match.summary}
        </p>
      )}
    </>
  );

  if (showLink) {
    return (
      <Link
        to={`/match/${match.id}`}
        className="block bg-slate-800 rounded-xl p-4 border border-slate-700 hover:bg-slate-750 hover:border-slate-600 transition-colors"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
      {cardContent}
    </div>
  );
}
