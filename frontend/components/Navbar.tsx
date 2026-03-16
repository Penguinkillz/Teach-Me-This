"use client";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 shadow-lg shadow-purple-900/50">
            <span className="text-sm font-bold text-white">✦</span>
          </div>
          <span className="font-semibold tracking-tight text-white">
            Teach Me This
          </span>
        </div>
        <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
          Beta
        </span>
      </div>
    </header>
  );
}
