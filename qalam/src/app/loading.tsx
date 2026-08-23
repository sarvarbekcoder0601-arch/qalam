import { Loader2, PenLine } from 'lucide-react'

export default function RootLoading() {
  return (
    <div className="h-screen w-full bg-[#09090b] flex flex-col items-center justify-center space-y-4 text-slate-100 font-sans z-50">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
          <PenLine className="w-8 h-8 text-amber-400 animate-bounce" />
        </div>
        <Loader2 className="w-20 h-20 text-amber-400/40 animate-spin absolute -top-2 -left-2 pointer-events-none" />
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
          Qalam
        </h3>
        <p className="text-xs text-slate-500 font-serif animate-pulse">
          Yuklanmoqda...
        </p>
      </div>
    </div>
  )
}
