// page.tsx
"use client"
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import ThreeScene from "@/components/ThreeScene";
import GamePhaseButtons from "@/components/GamePhaseButtons";
import { LeftDrawer } from "@/components/LeftDrawer";
import { RightDrawer } from "@/components/RightDrawer";
import { playersAtom, handleCellClickAtom } from '@/atoms/gameAtoms';

// Define the PopulationMarkerData interface
interface PopulationMarkerData {
  lat: number;
  lon: number;
  population: number;
  cityName: string;
  connections: string[];
}

export default function Home() {
  const [, setPlayers] = useAtom(playersAtom);
  const [, handleCellClick] = useAtom(handleCellClickAtom);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isTurn, setIsTurn] = useState(false);
  const [populationMarkerData] = useState<PopulationMarkerData[]>([
    { lat: 42.16, lon: -21.91, population: 1000, cityName: 'Phoenix', connections: ['City2', 'City3'] },
    { lat: 65, lon: 100, population: 500, cityName: 'City2', connections: ['Phoenix', 'City4'] },
    { lat: 90, lon: 130, population: 750, cityName: 'City3', connections: ['Phoenix', 'City4'] },
    { lat: 45, lon: 145, population: 250, cityName: 'City4', connections: ['City2', 'City3'] },
  ]);

  useEffect(() => {
    // Initialize players
    setPlayers([
      { id: '1', name: 'Player 1', color: '#ff0000' },
    ]);
  }, [setPlayers]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsTurn(true);
  };

  const handleEndTurn = () => {
    setIsTurn(false);
    // Add logic to switch to next player's turn
  };

  const handleBuy = () => {
    // Add buy logic
  };

  const handleCards = () => {
    // Add cards logic
  };

  return (
    <main className="min-h-screen bg-gray-100 overflow-hidden">
      <LeftDrawer />
      <RightDrawer />
      <ThreeScene 
        populationMarkerData={populationMarkerData}
      />
      <GamePhaseButtons 
        isGameStarted={isGameStarted}
        isTurn={isTurn}
        onStartGame={handleStartGame}
        onEndTurn={handleEndTurn}
        onBuy={handleBuy}
        onCards={handleCards}
      />
    </main>
  );
}
