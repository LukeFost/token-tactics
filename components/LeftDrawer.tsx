// components/LeftDrawer.tsx
"use client"
import { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, ChevronLeft } from "lucide-react";
import TerritoryTable from "./TerritoryTable";
import PlayerManagementButton from "./PlayerManagementButton";
import ErrorBoundary from "./ErrorBoundary";
import { ownedTerritoriesAtom, allTerritoriesAtom, currentPlayerAtom, currentTurnAtom } from '@/atoms/gameAtoms';

export const LeftDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ownedTerritories] = useAtom(ownedTerritoriesAtom);
  const [allTerritories] = useAtom(allTerritoriesAtom);
  const [currentPlayer] = useAtom(currentPlayerAtom);
  const [currentTurn] = useAtom(currentTurnAtom);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Content = () => (
    <>
      <div className="flex items-center space-x-4 mb-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Button>Connect</Button>
      </div>
      <ErrorBoundary fallback={<div>Player Management is currently unavailable.</div>}>
        <PlayerManagementButton />
      </ErrorBoundary>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Game Info</h2>
        <p>Current Turn: {currentTurn}</p>
        <p>Current Player: {currentPlayer?.name || 'N/A'}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Owned Territories</h2>
        <TerritoryTable territories={ownedTerritories} />
      
        <h2 className="text-lg font-semibold mt-6 mb-2">All Territories</h2>
        <TerritoryTable 
          territories={allTerritories} 
          showAllTerritories={true} 
        />
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-0 top-1/2 -translate-y-1/2 z-20">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Content />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <div className={`fixed left-0 top-0 h-full w-[60px] bg-gray-200 transition-all duration-300 z-10 ${open ? 'translate-x-[300px] sm:translate-x-[400px] opacity-0' : 'translate-x-0 opacity-100'}`}>
        <Avatar className="absolute left-2 top-4 z-20">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        className={`fixed left-0 top-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${open ? 'translate-x-[300px] sm:translate-x-[400px]' : 'translate-x-[60px]'}`} 
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] z-30 bg-white">
          <Content />
        </SheetContent>
      </Sheet>
    </>
  );
}
