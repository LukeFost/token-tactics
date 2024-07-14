// contexts/GameContext.tsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Territory } from '@/components/TerritoryTable';
import { Cell } from '@/components/CustomMap'; // Make sure to import Cell type

interface Player {
  id: string;
  name: string;
  color: string;
}

interface GameContextType {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  currentPlayer: Player | null;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  ownedTerritories: Territory[];
  setOwnedTerritories: React.Dispatch<React.SetStateAction<Territory[]>>;
  allTerritories: Territory[];
  setAllTerritories: React.Dispatch<React.SetStateAction<Territory[]>>;
  currentTurn: number;
  setCurrentTurn: React.Dispatch<React.SetStateAction<number>>;
  handleCellClick: (cell: Cell) => void;
  nextTurn: () => void;
  addTerritory: (territory: Territory) => void;
  removeTerritory: (territoryId: string) => void;
  currentGameID: string;
  setCurrentGameID: React.Dispatch<React.SetStateAction<string>>;
}

export const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [ownedTerritories, setOwnedTerritories] = useState<Territory[]>([]);
  const [allTerritories, setAllTerritories] = useState<Territory[]>([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [currentGameID, setCurrentGameID] = useState<string>('');


  const nextTurn = useCallback(() => {
    const nextPlayerIndex = (players.indexOf(currentPlayer!) + 1) % players.length;
    setCurrentPlayer(players[nextPlayerIndex]);
    setCurrentTurn(prev => {
      const newTurn = prev + 1;
      console.log(`Turn advanced to ${newTurn}`);
      return newTurn;
    });
  }, [players, currentPlayer]);

  const addTerritory = useCallback((territory: Territory) => {
    setOwnedTerritories(prev => {
      const newOwnedTerritories = [...prev, territory];
      console.log(`Territory added: ${territory.id}`, newOwnedTerritories);
      return newOwnedTerritories;
    });
    setAllTerritories(prev => {
      const newAllTerritories = prev.map(t => t.id === territory.id ? territory : t);
      console.log(`All territories updated after adding ${territory.id}`, newAllTerritories);
      return newAllTerritories;
    });
  }, []);
  
  const removeTerritory = useCallback((territoryId: string) => {
    setOwnedTerritories(prev => {
      const newOwnedTerritories = prev.filter(t => t.id !== territoryId);
      console.log(`Territory removed: ${territoryId}`, newOwnedTerritories);
      return newOwnedTerritories;
    });
    setAllTerritories(prev => {
      const newAllTerritories = prev.map(t => t.id === territoryId ? { ...t, owner: null } : t);
      console.log(`All territories updated after removing ${territoryId}`, newAllTerritories);
      return newAllTerritories;
    });
  }, []);

  useEffect(() => {
    if (players.length > 0 && !currentPlayer) {
      setCurrentPlayer(players[0]);
      console.log(`Initial player set: ${players[0].name}`);
    }
  }, [players, currentPlayer]);

  const handleCellClick = useCallback((cell: Cell) => {
    if (!currentPlayer) {
      console.log('Not current player, cell click ignored');
      return;
    }
    
    const territoryId = `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`;
    console.log(`Cell clicked: ${territoryId}`);
    
    setAllTerritories(prevTerritories => {
      const existingTerritory = prevTerritories.find(t => t.id === territoryId);
      
      if (existingTerritory) {
        if (existingTerritory.owner === currentPlayer.id) {
          console.log(`Removing territory ${territoryId} from current player ${currentPlayer.name}`);
          return prevTerritories.map(t => t.id === territoryId ? {...t, owner: null, turnCaptured: 0} : t);
        } else {
          console.log(`Capturing territory ${territoryId} for current player ${currentPlayer.name}`);
          return prevTerritories.map(t => t.id === territoryId ? {...t, owner: currentPlayer.id, turnCaptured: currentTurn} : t);
        }
      } else {
        console.log(`Adding new territory ${territoryId} for current player ${currentPlayer.name}`);
        return [
          ...prevTerritories,
          {
            id: territoryId,
            name: territoryId,
            owner: currentPlayer.id,
            turnCaptured: currentTurn,
          }
        ];
      }
    });
  
    setOwnedTerritories(prevOwned => {
      const existingIndex = prevOwned.findIndex(t => t.id === territoryId);
      if (existingIndex !== -1) {
        return prevOwned.filter(t => t.id !== territoryId);
      } else {
        return [
          ...prevOwned,
          {
            id: territoryId,
            name: territoryId,
            owner: currentPlayer.id,
            turnCaptured: currentTurn,
          }
        ];
      }
    });
  }, [currentPlayer, currentTurn]);

  
  return (
    <GameContext.Provider value={{
      players,
      setPlayers,
      currentPlayer,
      setCurrentPlayer,
      ownedTerritories,
      setOwnedTerritories,
      allTerritories,
      setAllTerritories,
      currentTurn,
      setCurrentTurn,
      handleCellClick,
      nextTurn,
      addTerritory,
      removeTerritory,
      currentGameID,
      setCurrentGameID,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};