// page.tsx
import ThreeScene from "@/components/ThreeScene";
import GamePhaseButtons from "@/components/GamePhaseButtons";
import { LeftDrawer } from "@/components/LeftDrawer";
import { RightDrawer } from "@/components/RightDrawer";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 overflow-hidden">
      <LeftDrawer/>
      <RightDrawer/>
      <ThreeScene />
      <GamePhaseButtons />
    </main>
  );
}