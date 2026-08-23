'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, Eye } from 'lucide-react'
import { Work, CATEGORY_LABELS } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'
import { getAllPublishedWorks } from '@/lib/storage'
import Link from 'next/link'

export default function ExplorePage() {
  const [works, setWorks] = useState<Work[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')

  useEffect(() => {
    const allWorks = getAllPublishedWorks()
    setWorks(allWorks)
  }, [])

  const filteredWorks = works.filter(w => {
    const matchesCategory = category === 'all' || w.category === category
    const matchesSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      (w.profiles?.full_name && w.profiles.full_name.toLowerCase().includes(search.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Asarlar <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">Kashfiyoti</span>
        </h1>
        <p className="text-slate-400 text-sm">Platformada yaratilgan va nashr etilgan barcha ijodiy ishlar hamjamiyati</p>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Asar sarlavhasi yoki teg bo'yicha qidiring..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              category === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Hammasi
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === key
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of works */}
      {filteredWorks.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p>Hech qanday asar topilmadi</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <Link
              key={work.id}
              href={`/works/${work.id}`}
              className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                    {CATEGORY_LABELS[work.category]}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {work.view_count || 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {work.title}
                </h3>

                <div
                  className="text-xs text-slate-400 line-clamp-3 font-serif leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: work.content }}
                />
              </div>

              {/* Author footer */}
              <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400">
                  {getInitials(work.profiles?.full_name || 'Yozuvchi')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">{work.profiles?.full_name || 'Muallif'}</p>
                  <p className="text-[10px] text-slate-500">{formatDate(work.created_at)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
