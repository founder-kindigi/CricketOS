import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCricketStore } from '../store/cricketStore';
import { format } from '../utils/date';
import { 
  ChevronLeft, MapPin, Calendar, Clock, Trophy, Users, 
  Edit2, Trash2, Share2, Star, Check, MessageSquare
} from 'lucide-react';

export function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { matches, getPlayerById, deleteMatch, updateMatch } = useCricketStore();
  
  const match = matches.find((m) => m.id === id);
  const [copied, setCopied] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(match?.rating || 0);

  if (!match) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy size={32} className="text-slate-600" />
        </div>
        <p className="text-slate-400 mb-4">Match not found</p>
        <Link to="/" className="text-emerald-400 hover:text-emerald-300">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this match? This cannot be undone.')) {
      deleteMatch(match.id);
      navigate('/');
    }
  };

  const handleShare = async () => {
    const text = generateMatchText(match);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cricket Match - ${format(match.date)}`,
          text,
        });
      } catch (e) {
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateMatchText = (m: typeof match) => {
    const teamANames = m.teamA.players.map(id => getPlayerById(id)?.name || '').join(', ');
    const teamBNames = m.teamB.players.map(id => getPlayerById(id)?.name || '').join(', ');
    
    let result = '';
    if (m.result) {
      if (m.result.winner === 'A') {
        result = `Team A wins${m.result.score ? ` (${m.result.score})` : ''}`;
      } else if (m.result.winner === 'B') {
        result = `Team B wins${m.result.score ? ` (${m.result.score})` : ''}`;
      } else {
        result = 'Match Draw';
      }
    }

    return `
🏏 CricketOS Match
📍 ${m.location}
📅 ${format(m.date)} | ${m.day} | ${m.time}

Team A: ${teamANames}
Team B: ${teamBNames}

${result ? `🏆 ${result}` : ''}
${m.summary ? `\n📝 ${m.summary}` : ''}
    `.trim();
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    updateMatch(match.id, { rating: stars });
    setShowRating(false);
  };

  const teamAOtherWins = matches.filter(
    (m) => m.id !== match.id && 
    m.teamA.players.some(id => match.teamA.players.includes(id)) &&
    m.result?.winner === 'A'
  ).length;

  const teamBOtherWins = matches.filter(
    (m) => m.id !== match.id && 
    m.teamB.players.some(id => match.teamB.players.includes(id)) &&
    m.result?.winner === 'B'
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/" className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold flex-1">Match Details</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowRating(!showRating)}
            className={`p-2 rounded-xl transition-colors ${match.rating ? 'text-amber-400' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Star size={20} fill={match.rating ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
          >
            {copied ? <Check size={20} className="text-emerald-400" /> : <Share2 size={20} />}
          </button>
          <Link
            to={`/match/${match.id}/edit`}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
          >
            <Edit2 size={20} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-slate-400 hover:text-red-400"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {showRating && (
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-sm text-slate-300 mb-3 text-center">Rate this match</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="p-2 hover:scale-110 transition-transform"
              >
                <Star
                  size={28}
                  className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-emerald-400" />
          <span className="text-slate-100 font-medium">{format(match.date)}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{match.day}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-blue-400" />
          <span className="text-slate-300">{match.time}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-orange-400" />
          <span className="text-slate-300">{match.location}</span>
        </div>

        {match.rating && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-700/50">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < match.rating! ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users size={18} className="text-purple-400" />
          Teams
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-emerald-400 font-medium">Team A</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                {teamAOtherWins + (match.result?.winner === 'A' ? 1 : 0)} wins
              </span>
            </div>
            <div className="space-y-1">
              {match.teamA.players.map((playerId) => {
                const player = getPlayerById(playerId);
                const isCaptain = playerId === match.teamA.captain;
                return (
                  <div
                    key={playerId}
                    className={`text-sm ${isCaptain ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}
                  >
                    {player?.name || 'Unknown'} {isCaptain && '(c)'}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-blue-400 font-medium">Team B</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                {teamBOtherWins + (match.result?.winner === 'B' ? 1 : 0)} wins
              </span>
            </div>
            <div className="space-y-1">
              {match.teamB.players.map((playerId) => {
                const player = getPlayerById(playerId);
                const isCaptain = playerId === match.teamB.captain;
                return (
                  <div
                    key={playerId}
                    className={`text-sm ${isCaptain ? 'text-blue-400 font-semibold' : 'text-slate-300'}`}
                  >
                    {player?.name || 'Unknown'} {isCaptain && '(c)'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {match.result && (
        <div className={`rounded-2xl p-4 border ${
          match.result.winner === 'A' 
            ? 'bg-emerald-500/10 border-emerald-500/20' 
            : match.result.winner === 'B'
            ? 'bg-blue-500/10 border-blue-500/20'
            : 'bg-slate-800/50 border-slate-700/50'
        }`}>
          <div className="flex items-center gap-3">
            <Trophy size={28} className={
              match.result.winner === 'A' 
                ? 'text-emerald-400' 
                : match.result.winner === 'B'
                ? 'text-blue-400'
                : 'text-slate-400'
            } />
            <div>
              <p className={`font-bold text-lg ${
                match.result.winner === 'A' 
                  ? 'text-emerald-400' 
                  : match.result.winner === 'B'
                  ? 'text-blue-400'
                  : 'text-slate-400'
              }`}>
                {match.result.winner === 'A' && 'Team A Wins'}
                {match.result.winner === 'B' && 'Team B Wins'}
                {match.result.winner === 'draw' && 'Match Draw'}
              </p>
              {match.result.score && (
                <p className="text-slate-300 text-sm">Score: {match.result.score}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {match.summary && (
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <MessageSquare size={16} className="text-slate-400" />
            Summary
          </h3>
          <p className="text-slate-300 text-sm whitespace-pre-wrap">{match.summary}</p>
        </div>
      )}

      <div className="text-center text-slate-500 text-xs pt-4">
        Created {new Date(match.createdAt).toLocaleDateString()}
        {match.isQuickMatch && ' • Quick Match'}
      </div>
    </div>
  );
}
