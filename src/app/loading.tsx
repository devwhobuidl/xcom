export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-2 border-primary rounded-full animate-spin border-t-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary font-black italic tracking-tighter text-xl">$</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white animate-pulse">
            Connecting to the rebellion...
          </h2>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            Charging the chaos engine
          </p>
        </div>
      </div>
    </div>
  );
}
