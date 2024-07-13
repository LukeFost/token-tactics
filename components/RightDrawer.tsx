"use client"
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function RightDrawer() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Content = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold">Info</h3>
        <p>Additional information goes here.</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold">Info</h3>
        <p>More information goes here.</p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="fixed right-0 top-1/2 -translate-y-1/2 z-20">
            <ChevronLeft className="h-4 w-4" />
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
      <div className={`fixed right-0 top-0 h-full w-[40px] bg-gray-200 transition-all duration-300 z-10 ${open ? '-translate-x-[300px] sm:-translate-x-[400px] opacity-0' : 'translate-x-0 opacity-100'}`}>
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        className={`fixed right-0 top-1/2 -translate-y-1/2 transition-all duration-300 z-20 ${open ? '-translate-x-[300px] sm:-translate-x-[400px]' : '-translate-x-[40px]'}`} 
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
  <SheetContent side="right" className="w-[300px] sm:w-[400px] z-30 bg-white">
    <Content />
  </SheetContent>
</Sheet>
    </>
  );
}
