// PopulationMarkerUI.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface PopulationMarkerUIProps {
  cityName: string;
  population: number;
  onDeploy: (amount: number) => void;
  onMove: (amount: number) => void;
}

const PopulationMarkerUI: React.FC<PopulationMarkerUIProps> = ({
  cityName,
  population,
  onDeploy,
  onMove,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeploy = () => {
    onDeploy(10); // Example: deploy 10 units
    setIsOpen(false);
  };

  const handleMove = () => {
    onMove(5); // Example: move 5 units
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bg-white p-2 rounded shadow">
      <h3>{cityName}</h3>
      <p>Population: {population}</p>
      <Button onClick={handleDeploy}>Deploy</Button>
      <Button onClick={handleMove}>Move</Button>
    </div>
  );
};

export default PopulationMarkerUI;
