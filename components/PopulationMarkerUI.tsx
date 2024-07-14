// PopulationMarkerUI.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PopulationMarkerUIProps {
  cityName: string;
  population: number;
  onDeploy: (amount: number) => void;
  onMove: (amount: number) => void;
  position: { x: number, y: number };
}

const PopulationMarkerUI: React.FC<PopulationMarkerUIProps> = ({
  cityName,
  population,
  onDeploy,
  onMove,
  position,
}) => {
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleDeploy = () => {
    onDeploy(amount);
    setIsDeployDialogOpen(false);
  };

  const handleMove = () => {
    onMove(amount);
    setIsMoveDialogOpen(false);
  };

  return (
    <div style={{
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 1000,
      background: 'white',
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    }}>
      <h3>{cityName}</h3>
      <p>Population: {population}</p>
      <Button onClick={() => setIsDeployDialogOpen(true)}>Deploy</Button>
      <Button onClick={() => setIsMoveDialogOpen(true)}>Move</Button>

      <Dialog open={isDeployDialogOpen} onOpenChange={setIsDeployDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy Population</DialogTitle>
          </DialogHeader>
          <Slider
            value={[amount]}
            onValueChange={(value) => setAmount(value[0])}
            max={population}
            step={1}
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            max={population}
          />
          <DialogFooter>
            <Button onClick={handleDeploy}>Deploy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Population</DialogTitle>
          </DialogHeader>
          <Slider
            value={[amount]}
            onValueChange={(value) => setAmount(value[0])}
            max={population}
            step={1}
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            max={population}
          />
          <DialogFooter>
            <Button onClick={handleMove}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PopulationMarkerUI;
