import { useState } from 'react';
import { useCricketStore } from '../store/cricketStore';
import { Plus, Trash2, Edit2, X, ChevronLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TeamPresets() {
  const { teamPresets, players, addTeamPreset, updateTeamPreset, deleteTeamPreset, getPlayerById } = useCricketStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [captain, setCaptain] = useState('');

  const resetForm = () => {
    setName('');
    setSelectedPlayers([]);
    setCaptain('');
    setShowAddModal(false);
    setEditingPreset(null);
  };

  const handleAdd = () => {
    if (!name.trim() || selectedPlayers.length === 0) return;
    addTeamPreset({
      name,
      players: selectedPlayers,
      captain: captain || selectedPlayers[0],
    });
    resetForm();
  };

  const handleEdit = (preset: typeof teamPresets[0]) => {
    setEditingPreset(preset.id);
    setName(preset.name);
    setSelectedPlayers(preset.players);
    setCaptain(preset.captain);
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    if (!editingPreset || !name.trim()) return;
    updateTeamPreset(editingPreset, {
      name,
      players: selectedPlayers,
      captain: captain || selectedPlayers[0],
    });
    resetForm();
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
    if (captain === playerId) {
      setCaptain('');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold flex-1">Team Presets</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">New</span>
        </button>
      </div>

      {teamPresets.length > 0 ? (
        <div className="space-y-3">
          {teamPresets.map((preset) => (
              <div
                key={preset.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-100">{preset.name}</h3>
                    <p className="text-sm text-slate-400">
                      {preset.players.length} players
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(preset)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteTeamPreset(preset.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {preset.players.map((playerId) => {
                    const player = getPlayerById(playerId);
                    const isCaptain = playerId === preset.captain;
                    return (
                      <span
                        key={playerId}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isCaptain
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {player?.name || 'Unknown'} {isCaptain && '(c)'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p className="mb-2">No team presets yet</p>
          <p className="text-sm">Save common team combinations for quick access</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-emerald-400 hover:text-emerald-300"
          >
            Create your first preset
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold">
                {editingPreset ? 'Edit Preset' : 'New Team Preset'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Preset Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Friday Night Team"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select Players
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {players.map((player) => {
                    const isSelected = selectedPlayers.includes(player.id);
                    const isCap = captain === player.id;
                    return (
                      <button
                        key={player.id}
                        onClick={() => togglePlayer(player.id)}
                        className={`px-3 py-2 rounded-lg text-sm text-left transition-colors flex items-center justify-between ${
                          isCap
                            ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400'
                            : isSelected
                            ? 'bg-slate-700 border border-slate-600 text-slate-200'
                            : 'bg-slate-800 border border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>{player.name}</span>
                        {isCap && <span className="text-xs">(c)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedPlayers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Captain
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlayers.map((playerId) => {
                      const player = getPlayerById(playerId);
                      return (
                        <button
                          key={playerId}
                          onClick={() => setCaptain(playerId)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            captain === playerId
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {player?.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-700">
              <button
                onClick={editingPreset ? handleUpdate : handleAdd}
                disabled={!name.trim() || selectedPlayers.length === 0}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {editingPreset ? 'Update Preset' : 'Create Preset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
