import React, { useState, useContext, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { GameContext } from '@/contexts/GameContext';

interface Player {
  id: string;
  name: string;
  color: string;
}

const PlayerManagementButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { players, setPlayers } = useContext(GameContext);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleAddPlayer = useCallback(() => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `Player ${players?.length ? players.length + 1 : 1}`,
      color: 'rgba(255, 0, 0, 1)',
    };
    setPlayers(prevPlayers => [...(prevPlayers || []), newPlayer]);
  }, [players, setPlayers]);

  const handleEditPlayer = useCallback((player: Player) => {
    setEditingPlayer(player);
  }, []);

  const handleRemovePlayer = useCallback((playerId: string) => {
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
  }, [setPlayers]);

  const handleSaveEdit = useCallback((updatedPlayer: Player) => {
    setPlayers(prevPlayers => prevPlayers.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    setEditingPlayer(null);
  }, [setPlayers]);

  const handleInputChange = useCallback((field: 'name' | 'color', value: string) => {
    setEditingPlayer(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const renderEditingContent = useMemo(() => (
    <div>
      <Button variant="ghost" onClick={() => setEditingPlayer(null)}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Input
        value={editingPlayer?.name || ''}
        onChange={(e) => handleInputChange('name', e.target.value)}
        className="mt-4"
        placeholder="Player Name"
      />
      <Input
        value={editingPlayer?.color || ''}
        onChange={(e) => handleInputChange('color', e.target.value)}
        className="mt-2"
        placeholder="RGBA Color (e.g., rgba(255, 0, 0, 1))"
      />
      <Button onClick={() => editingPlayer && handleSaveEdit(editingPlayer)} className="mt-4">
        Save Changes
      </Button>
    </div>
  ), [editingPlayer, handleInputChange, handleSaveEdit]);

  const renderPlayerList = useMemo(() => (
    <div>
      {players && players.length > 0 ? (
        players.map(player => (
          <div key={player.id} className="flex items-center justify-between mt-2">
            <span>{player.name}</span>
            <div>
              <Button variant="ghost" onClick={() => handleEditPlayer(player)}>Edit</Button>
              <Button variant="ghost" onClick={() => handleRemovePlayer(player.id)}>Remove</Button>
            </div>
          </div>
        ))
      ) : (
        <p>No players added yet.</p>
      )}
      <Button onClick={handleAddPlayer} className="mt-4">Add Player</Button>
    </div>
  ), [players, handleEditPlayer, handleRemovePlayer, handleAddPlayer]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Players</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Player Management</DialogTitle>
        </DialogHeader>
        {editingPlayer ? renderEditingContent : renderPlayerList}
      </DialogContent>
    </Dialog>
  );
};

export default PlayerManagementButton;
