// components/GamePhaseButtons.tsx
import React from 'react';
import { Button } from "@/components/ui/button";

const GamePhaseButtons = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4">
      <div className="relative max-w-md mx-auto">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-t-lg">
          Current Phase
        </div>
        <div className="flex justify-center items-end rounded-lg shadow-lg overflow-hidden">
          <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6">
            BUY
          </Button>
          <Button variant="default" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-6">
            End Turn
          </Button>
          <Button variant="default" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6">
            Cards
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GamePhaseButtons;