// hooks/useGameState.ts
import { useState, useCallback } from 'react';
import { Cell } from "@/components/CustomMap";
import { Territory } from "@/components/TerritoryTable";

interface GameState {
  currentTurn: number;
  currentPlayer: string;
  ownedTerritories: Territory[];
  allTerritories: Territory[];
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentTurn: 1,
    currentPlayer: 'Player 1',
    ownedTerritories: [],
    allTerritories: [],
  });

  const handleCellClick = useCallback((cell: Cell) => {
    console.log(`Cell clicked: ${cell.id}`);
    setGameState(prevState => {
      const territoryId = `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`;
      const existingTerritoryIndex = prevState.ownedTerritories.findIndex(t => t.id === territoryId);
      const allTerritoriesIndex = prevState.allTerritories.findIndex(t => t.id === territoryId);

      if (existingTerritoryIndex !== -1) {
        console.log(`Removing territory ${territoryId} from owned territories`);
        const newOwnedTerritories = [...prevState.ownedTerritories];
        newOwnedTerritories.splice(existingTerritoryIndex, 1);
        
        const newAllTerritories = [...prevState.allTerritories];
        newAllTerritories[allTerritoriesIndex] = {
          ...newAllTerritories[allTerritoriesIndex],
          owner: 'Neutral',
          turnCaptured: 0,
        };

        console.log('Updated game state:', {
          ...prevState,
          ownedTerritories: newOwnedTerritories,
          allTerritories: newAllTerritories,
        });

        return {
          ...prevState,
          ownedTerritories: newOwnedTerritories,
          allTerritories: newAllTerritories,
        };
      } else {
        console.log(`Adding territory ${territoryId} to owned territories`);
        const newTerritory: Territory = {
          id: territoryId,
          name: `Cell-${cell.id}`,
          owner: prevState.currentPlayer,
          turnCaptured: prevState.currentTurn,
        };

        const newAllTerritories = [...prevState.allTerritories];
        newAllTerritories[allTerritoriesIndex] = newTerritory;

        console.log('Updated game state:', {
          ...prevState,
          ownedTerritories: [...prevState.ownedTerritories, newTerritory],
          allTerritories: newAllTerritories,
        });

        return {
          ...prevState,
          ownedTerritories: [...prevState.ownedTerritories, newTerritory],
          allTerritories: newAllTerritories,
        };
      }
    });
  }, []);

  // Initialize all territories as neutral
  const initializeAllTerritories = useCallback((cells: Cell[]) => {
    console.log('Initializing all territories');
    const allTerritories = cells.map(cell => ({
      id: `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`,
      name: `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`,
      owner: 'Neutral',
      turnCaptured: 0,
    }));
    setGameState(prevState => ({
      ...prevState,
      allTerritories,
    }));
  }, []);

  return { gameState, handleCellClick, initializeAllTerritories };
};