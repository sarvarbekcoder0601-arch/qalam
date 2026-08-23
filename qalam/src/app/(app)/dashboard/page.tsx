'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Edit3, BookOpen, TrendingUp, Clock, ArrowRight, PenLine, Sparkles } from 'lucide-react'
import { Profile, Work, CATEGORY_LABELS } from '@/types'
import { formatDate } from '@/lib/utils'
import { InspirationModal } from '@/components/InspirationModal'
import { getLocalWorks, getLocalProfile } from '@/lib/storage'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile>(getLocalProfile())
  const [myWorks, setMyWorks] = useState<Work[]>([])
  const [isInspirationOpen, setIsInspirationOpen] = useState(false)

  useEffect(() => {
    setProfile(getLocalProfile())
    setMyWorks(getLocalWorks())
  }, [])

  const publishedCount = myWorks.filter(w => w.is_published).length
  const totalViews = myWorks.reduce((acc, w) => acc + (w.view_count || 0), 0)

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2 relative z-10">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
            ✦ Qalam IJodiy Paneli
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Xush kelibsiz, <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">{profile.full_name}</span>!
          </h1>
          <p className="text-sm text-slate-400 font-serif">
            Bugun qanday yangi ssenariy yoki she&apos;r yaratamiz?
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsInspirationOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            Tasodifiy Mavzu & Sinonimlar
          </button>
          <Link
            href="/editor"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/10"
          >
            <PenLine className="w-4 h-4" />
            Yangi Yozish
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Barcha Asarlarim</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{myWorks.length}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Jami O&apos;qildi</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{totalViews}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Nashr Etilgan</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white">{publishedCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Shoirona Qofiyalar</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-400">12+ Lug&apos;at</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Recent Works */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              Oxirgi Ijodiy Ishlarim
            </h2>
            <Link href="/editor" className="text-xs text-amber-400 hover:underline">
              + Yangi qo&apos;shish
            </Link>
          </div>

          <div className="space-y-3">
            {myWorks.map((work) => (
              <Link
                key={work.id}
                href={`/editor/${work.id}`}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4 block group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                      {CATEGORY_LABELS[work.category]}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${work.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {work.is_published ? 'Nashr' : 'Qoralama'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-base truncate group-hover:text-amber-400 transition-colors">
                    {work.title || 'Nomsiz asar'}
                  </h3>
                  <p className="text-xs text-slate-500">{formatDate(work.created_at)}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Explore Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              Kashfiyot
            </h2>
            <Link href="/explore" className="text-xs text-amber-400 hover:underline">
              Barchasi →
            </Link>
          </div>

          <div className="space-y-3">
            {myWorks.filter(w => w.is_published).map((rw) => (
              <Link
                key={rw.id}
                href={`/works/${rw.id}`}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all block space-y-2"
              >
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {CATEGORY_LABELS[rw.category]}
                </span>
                <h4 className="font-semibold text-slate-200 text-sm hover:text-amber-400 transition-colors">
                  {rw.title}
                </h4>
                <p className="text-xs text-slate-500">{rw.view_count || 1} marta o&apos;qildi</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Inspiration Modal */}
      <InspirationModal
        isOpen={isInspirationOpen}
        onClose={() => setIsInspirationOpen(false)}
      />
    </div>
  )
}
