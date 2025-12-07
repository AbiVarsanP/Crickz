import React from 'react';
// Badge removed; ConnectionStatus component provides status badge
import ConnectionStatus from '@/components/ConnectionStatus';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  children: React.ReactNode;
};

export default function FuturisticLayout({ children }: Props) {
  return (
    <div className="h-screen futuristic-bg text-slate-100 overflow-hidden">
      <div className="relative z-10">
        <header className="w-full neon-hud fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-xs sm:text-sm">CZ</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight truncate">Cricktz</h1>
                <p className="text-xs text-slate-300 hidden md:block">Multiplayer · Real-time · Neon</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* How to Play dialog trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="text-xs sm:text-sm text-slate-200 px-2 sm:px-3 py-1 bg-transparent hover:bg-[hsl(var(--accent)/0.06)]">How to Play</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>How to Play</DialogTitle>
                    <DialogDescription className="mt-2">Quick guide to play Cricktz</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 text-slate-300 space-y-2">
                    <ol className="list-decimal list-inside">
                      <li>Create or join a room with a friend.</li>
                      <li>Win the toss and choose to bat or bowl.</li>
                      <li>Select numbers 1–6 each ball. If numbers match, you're out.</li>
                      <li>Defend your total across configured overs/wickets.</li>
                    </ol>
                  </div>
                  <DialogFooter>
                    <DialogClose>
                      <Button className="mt-4">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="text-sm text-slate-300">Status</div>
              <ConnectionStatus />
            </div>
          </div>
        </header>

        {/* spacer so fixed header doesn't overlap content (responsive) */}
        <div aria-hidden className="h-12 sm:h-16" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* decorative overlays (hidden on small screens to avoid overflow) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <svg className="hidden sm:block absolute right-[-5%] top-6 opacity-20 transform-gpu" width="420" height="420" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="210" cy="210" r="140" stroke="rgba(128,90,240,0.12)" strokeWidth="2" />
        </svg>

        <svg className="hidden sm:block absolute left-[-6%] bottom-10 opacity-10 transform-gpu" width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="340" height="340" rx="24" stroke="rgba(20,200,200,0.08)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
