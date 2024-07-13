// page.tsx
"use client"
import { useEffect, useCallback } from 'react';
import ThreeScene from "@/components/ThreeScene";
import GamePhaseButtons from "@/components/GamePhaseButtons";
import { LeftDrawer } from "@/components/LeftDrawer";
import { RightDrawer } from "@/components/RightDrawer";
import { GameProvider, useGame } from '@/contexts/GameContext';
import { Cell } from '../components/CustomMap';
import { Territory } from '../components/TerritoryTable';

const HomeContent = () => {
  const { handleCellClick, setPlayers, setAllTerritories } = useGame();

  const memoizedHandleCellClick = useCallback((cell: Cell) => {
    handleCellClick(cell);
  }, [handleCellClick]);

  const initializeAllTerritories = useCallback((cells: Cell[]) => {
    const territories = cells.map(cell => ({
      id: `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`,
      name: `Cell-${Math.round(cell.x)}-${Math.round(cell.y)}`,
      owner: null,
      turnCaptured: 0,
    }));
    setAllTerritories(territories);
  }, [setAllTerritories]);

  useEffect(() => {
    // Initialize players
    setPlayers([
      { id: '1', name: 'Player 1', color: '#ff0000' },
    ]);
  }, [setPlayers]);

  return (
    <main className="min-h-screen bg-gray-100 overflow-hidden">
      <LeftDrawer />
      <RightDrawer />
      <ThreeScene 
        onCellClick={memoizedHandleCellClick} 
        initializeAllTerritories={initializeAllTerritories} 
      />
      <GamePhaseButtons />
    </main>
  );
};

export default function Home() {
  return (
    <GameProvider>
      <HomeContent />
    </GameProvider>
  );
}