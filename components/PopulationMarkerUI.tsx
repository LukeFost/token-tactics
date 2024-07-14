// PopulationMarkerUI.tsx
import React, { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
    <ContextMenu>
      <ContextMenuTrigger>
      <div className="population-marker" style={{
  fontSize: '12px',
  color: 'white',
  background: 'rgba(0,0,0,0.5)',
  padding: '2px 5px',
  borderRadius: '3px',
  cursor: 'context-menu',
}}>
  {population}
</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => setIsDeployDialogOpen(true)}>Deploy</ContextMenuItem>
        <ContextMenuItem onSelect={() => setIsMoveDialogOpen(true)}>Move</ContextMenuItem>
      </ContextMenuContent>

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
    </ContextMenu>
  );
};

export default PopulationMarkerUI;
